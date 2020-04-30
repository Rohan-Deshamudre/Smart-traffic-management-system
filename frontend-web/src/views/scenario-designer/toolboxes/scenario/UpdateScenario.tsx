import * as React from 'react';
import '../../styles/toolbox.scss';
import { Mutation, Query } from 'react-apollo';
import {GET_TREE, GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import {GET_SCENARIO_INFO, UPDATE_SCENARIO} from "./ScenarioToolboxQueries";
import ScenarioToolbox from "./ScenarioToolbox";

type Props = {
	id: number,
	scenarioId: number,
	readOnly: boolean
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
					id: this.props.id,
					name: newData.name,
					description: newData.description,
					lng: newData.lng,
					lat: newData.lat
				},
				refetchQueries: [{ query: GET_TREE, variables: { id: this.props.scenarioId } }]
			}
		)
	}

	render() {
		return (
			<Query query={GET_SCENARIO_INFO} fetchPolicy="no-cache" variables={{id: this.props.id}}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Mutation mutation={UPDATE_SCENARIO}>
							{(updateScenario, {callbackData, client}) => (
								<div className='toolbox'>
									<p>Editing scenario: {this.props.id}</p>
									<ScenarioToolbox data={data}
													 disabled={this.props.readOnly}
													 handleData={(newData) => this.handleData(updateScenario, newData)}/>
								</div>

							)}
						</Mutation>
					)
				}}
			</Query>
		);
	}
}

export default UpdateScenario;
