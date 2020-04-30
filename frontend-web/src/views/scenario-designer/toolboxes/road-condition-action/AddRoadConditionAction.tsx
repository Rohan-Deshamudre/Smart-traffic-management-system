import * as React from 'react';
import '../../styles/toolbox.scss';
import {Mutation, Query} from "react-apollo";

import {
	ADD_ROAD_CONDITION_ACTION,
	GET_ROAD_CONDITION_ACTION_INFO,
	UPDATE_ROAD_CONDITION_ACTION
} from "./RoadConditionActionToolboxQueries";
import {GET_TREE, GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import RoadConditionActionToolbox from "./RoadConditionActionToolbox";
import {READ_FOLDERS} from "../../../../components/CRUDFolders";


type Props = {
	scenarioId: number,
	parentInfo: [number, string],
}

type State = {
}


class AddRoadConditionAction extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
		};

		this.handleData = this.handleData.bind(this);
	}

	handleData(mutationFunction, newData) {
		mutationFunction({
			variables: {
				roadConditionId: this.props.parentInfo[0],
				actionName: newData.actionName,
				description: newData.description,
				constraintName: newData.constraintName,
				constraintTypeId: newData.constraintTypeId,
				instrumentActionIds: newData.instrumentActionIds,
				instrumentSystemId: newData.instrumentSystemId,
				roadConditionActionGoalId: newData.roadConditionActionGoalId
			},
			refetchQueries: [{ query: GET_TREE, variables: { id: this.props.scenarioId } }, { query: READ_FOLDERS}]
		})
	}

	render() {
		return (
			<Mutation mutation={ADD_ROAD_CONDITION_ACTION}>
				{(createRoadConditionAction, {callbackData, client}) => (

					<div className='toolbox'>
						<p>Adding new road condition action for parent {this.props.parentInfo[0]}</p>
						<RoadConditionActionToolbox id={this.props.parentInfo[0]} handleData={(data) => this.handleData(createRoadConditionAction, data)} />
					</div>

				)}
			</Mutation>
		);
	}
}

export default AddRoadConditionAction;
