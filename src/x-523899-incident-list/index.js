import { createCustomElement, actionTypes } from "@servicenow/ui-core";
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import snabbdom from "@servicenow/ui-renderer-snabbdom";
import "@servicenow/now-template-card";
import { createHttpEffect } from "@servicenow/ui-effect-http";
import styles from "./styles.scss";

const view = (state, { updateState }) => {
	const { result } = state;
	return (
		<section>
			<h2>Incidents</h2>
			<div>
				{ result && result.map((item) => (
					<now-template-card-assist
						className="testCard"
						tagline={{
							icon: "tree-view-long-outline",
							label: item.sys_class_name,
						}}
						actions={[
							{ id: "open", label: "Open Recocd" },
							{ id: "delete", label: "Delete" },
						]}
						heading={{
							label: item.short_description,
						}}
						content={[
							{
								label: "Number",
								value: { type: "string", value: item.number },
							},
							{ label: "State", value: { type: "string", value: item.state } },
							{
								label: "Assignment Group",
								value: {
									type: "string",
									value: item.assignment_group.display_value,
								},
							},
							{
								label: "Assigned To",
								value: {
									type: "string",
									value: item.assigned_to.display_value,
								},
							},
						]}
						footerContent={{ label: "Updated", value: item.sys_updated_on }}
						contentItemMinWidth="300"
					></now-template-card-assist>
				))}
			</div>
		</section>
	);
};

createCustomElement("x-523899-incident-list", {

	eventHandlers: [{
    events: ['click'],
    effect({action: {payload: {event, host}}}) {
      console.log(event);
  //   }
  // }, {
  //   events: ['mousemove', 'mouseup'],
  //   effect({action: {payload: {event, host}}}) {
  //     console.log(event);
    },
    target: document
  }],

	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { dispatch } = coeffects;

			dispatch("FETCH_LATEST_INCIDENT", {
				sysparm_display_value: true,
			});
		},
		FETCH_LATEST_INCIDENT: createHttpEffect("api/now/table/incident", {
			method: "GET",
			queryParams: ["sysparm_display_value"],
			successActionType: "FETCH_LATEST_INCIDENT_SUCCESS",
		}),
		FETCH_LATEST_INCIDENT_SUCCESS: (coeffects) => {
			const { action, updateState } = coeffects;
			const { result } = action.payload;
			updateState({ result });
		},
	},
	renderer: { type: snabbdom },
	view,
	styles,
});
