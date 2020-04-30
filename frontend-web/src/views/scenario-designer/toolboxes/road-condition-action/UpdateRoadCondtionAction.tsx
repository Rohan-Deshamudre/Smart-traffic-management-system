import * as React from 'react';
import '../../styles/toolbox.scss';
import {Mutation, Query} from "react-apollo";

import {
	DELETE_ROAD_CONDITION_ACTION,
	GET_ROAD_CONDITION_ACTION_INFO,
	UPDATE_ROAD_CONDITION_ACTION
} from "./RoadConditionActionToolboxQueries";
import {GET_TREE, GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import RoadConditionActionToolbox from "./RoadConditionActionToolbox";
import {DELETE_ROAD_CONDITION} from "../road-condition/RoadConditionToolboxQueries";
import Button from "react-bootstrap/Button";
import {READ_FOLDERS} from "../../../../components/CRUDFolders";


type Props = {
	id: number,
	scenarioId: number,
	readOnly: boolean
}

type State = {
	id: number
}


class UpdateRoadConditionAction extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			id: this.props.id
		};
		this.handleData = this.handleData.bind(this);
	}

	handleData(mutationFunction, newData) {
		mutationFunction({
			variables: {
				id: this.props.id,
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
		const deleteButton = (
			<Mutation mutation={DELETE_ROAD_CONDITION_ACTION}>
				{(deleteRoadSegment, callbackData) => (
					<Button className="opslaan-button btn-danger" onClick={() =>
						deleteRoadSegment({
							variables: {
								id: this.props.id
							},
							refetchQueries: [{ query: GET_TREE, variables: { id: this.props.scenarioId } }]
						})
					}>Verwijder</Button>
				)}
			</Mutation>
		);

		return (
			<Query query={GET_ROAD_CONDITION_ACTION_INFO} fetchPolicy="no-cache" variables={{id: this.props.id}}>
				{({data, loading, error, refetch}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Mutation mutation={UPDATE_ROAD_CONDITION_ACTION}>
							{(updateRoadConditionAction, {callbackData, client}) => (

								<div className='toolbox'>
									<p>Editing road condition action: {this.props.id}</p>
									<RoadConditionActionToolbox readOnly={this.props.readOnly} id={this.props.id} data={data} handleData={(data) => this.handleData(updateRoadConditionAction, data)} />
									{!this.props.readOnly ? deleteButton : null}
								</div>

							)}
						</Mutation>
					)
				}}
			</Query>
		);
	}
}

export default UpdateRoadConditionAction;
