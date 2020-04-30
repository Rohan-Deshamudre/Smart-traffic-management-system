import * as React from 'react';
import '../../styles/toolbox.scss';
import { Mutation, Query } from 'react-apollo';
import {GET_TREE, GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import {ADD_SCENARIO, GET_SCENARIO_INFO, UPDATE_SCENARIO} from "./ScenarioToolboxQueries";
import ScenarioToolbox from "./ScenarioToolbox";

type Props = {
	id: number,
	handleData: (newData: any) => void
}

type State = {
}

/*
	ScenarioToolbox component
	Used by [LeftPane] in [Scenario-Designer]
	Shows corresponding input fields for a Scenario type in the decision tree
	It passes: state to parent.
 */
class UpdateScenario extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.handleData = this.handleData.bind(this);

	}

	handleData(mutationFunction, newData) {
		mutationFunction({
				variables: {
					name: newData.name,
					description: newData.description,
					lng: newData.lng,
					lat: newData.lat
				},
				refetchQueries: [{query: GET_TREE}]
			}
		)
	}

	render() {
		return (
			<Mutation mutation={ADD_SCENARIO}>
				{(createScenario, {callbackData, client}) => (
					<div className='toolbox'>
						<p>Adding new scenario</p>
						<ScenarioToolbox handleData={(newData) => this.handleData(createScenario, newData)}/>
					</div>
				)}
			</Mutation>

		);
	}
}

export default UpdateScenario;
