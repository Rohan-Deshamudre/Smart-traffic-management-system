import * as React from 'react';
import Button from "react-bootstrap/Button";
import {Mutation, Query} from 'react-apollo';
import {GET_TREE, GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import {DELETE_ROAD_SEGMENT, GET_ROAD_SEGMENT_INFO, UPDATE_ROAD_SEGMENT} from "./RoadSegmentToolboxQueries";
import RoadSegmentToolbox from "./RoadSegmentToolbox";

type Props = {
	id: number,
	scenarioId: number,
	readOnly: boolean
}

type State = {
	id: number
}

/*
	AddRoadSegment component
	Used by [AddRoadSegment] in [Scenario-Designer]
	Shows corresponding input fields for a RoadSegment type in the decision tree
	It passes: state to parent.
 */
class UpdateRoadSegment extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			id: this.props.id,
		};
		this.handleData = this.handleData.bind(this);

	}

	handleData(mutationFunction, newData) {
		mutationFunction({
			variables: {
				id: this.props.id,
				name: newData.name,
				roadSegmentTypeId: newData.roadSegmentTypeId,
				route: newData.route
			},
			refetchQueries: [{ query: GET_TREE, variables: { id: this.props.scenarioId } }]
		})
	}

	render() {
		const deleteButton = (
			<Mutation mutation={DELETE_ROAD_SEGMENT}>
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
			<Query query={GET_ROAD_SEGMENT_INFO} fetchPolicy="no-cache" variables={{id: this.props.id}}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Mutation mutation={UPDATE_ROAD_SEGMENT}>
							{(updateRoadSegment, callbackData) => (
                                <div className='toolbox'>
									<p>Editing roadsegment: {this.props.id}</p>
									<RoadSegmentToolbox id={this.props.id} readOnly={this.props.readOnly} data={data} handleData={(newData) => this.handleData(updateRoadSegment, newData)}/>
									{!this.props.readOnly ? deleteButton : null}
                                </div>
							)}
						</Mutation>
					)
				}}
			</Query>
		)
	}
}


export default UpdateRoadSegment;
