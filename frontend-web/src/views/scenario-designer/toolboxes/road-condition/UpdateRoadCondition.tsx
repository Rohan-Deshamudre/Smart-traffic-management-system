import * as React from 'react';
import '../../styles/toolbox.scss';
import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";
import RoadConditionToolbox from "./RoadConditionToolbox";
import {DELETE_ROAD_CONDITION, GET_ROAD_CONDITION_INFO, UPDATE_ROAD_CONDITION} from "./RoadConditionToolboxQueries";
import {GET_TREE, GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import {DELETE_ROAD_SEGMENT} from "../road-segment/RoadSegmentToolboxQueries";
import Button from "react-bootstrap/Button";


type Props = {
	id: number,
	scenarioId: number,
	client: any,
	readOnly: boolean
}

type State = {
	id: number
}

/*
	UpdateRoadCondition component
	Used by [UpdateRoadCondition] in [Scenario-Designer]
	Shows corresponding input fields for a Condition type in the decision tree
	It passes: state to parent.
 */
class UpdateRoadCondition extends React.Component<Props, State> {
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
				name: newData.name,
				startCron: newData.time.startCron,
				endCron: newData.time.endCron,
				startDate: newData.time.startDate,
				endDate: newData.time.endDate,
				endRepeatDate: newData.time.endRepeatDate,
				value: newData.level,
				roadConditionTypeId: newData.roadConditionTypeId
			},
			refetchQueries: [{query: GET_TREE, variables: {id: this.props.scenarioId}}]
		})
	}

	componentWillUnmount() {
		this.props.client.writeData(
			{
				data: {
					visibleInstruments: [],
					selectedRoute: []
				}
			}
		);
	}

	render() {
		const deleteButton = (
			<Mutation mutation={DELETE_ROAD_CONDITION}>
				{(deleteRoadSegment, callbackData) => (
					<Button className="opslaan-button btn-danger" onClick={() =>
						deleteRoadSegment({
							variables: {
								id: this.props.id
							},
							refetchQueries: [{query: GET_TREE, variables: {id: this.props.scenarioId}}]
						})
					}>Verwijder</Button>
				)}
			</Mutation>
		);

		return (
			<Query query={GET_ROAD_CONDITION_INFO} fetchPolicy="no-cache" variables={{id: this.props.id}}>
				{({data, loading, error, client}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;

					client.writeData(
						{
							data: {
								selectedRoute: data.roadSegmentsForRoadCondition[0].route.routePoints.map((routePoint) => [routePoint.lng, routePoint.lat]),
								selectedInstrumentActionRoutes: data.instrumentActionRoutesForRoadCondition.map((instrAct) => instrAct.routes.map(route => route.routePoints.map(routePoint => [routePoint.lng, routePoint.lat]))).flat(),
								visibleInstruments: data.instrumentActionRoutesForRoadCondition.map(instrAct => {
									if (instrAct?.routes[0]?.routePoints[0]?.lng !== undefined &&
										instrAct?.routes[0]?.routePoints[0]?.lat !== undefined) {
										return [instrAct.text, [instrAct.routes[0].routePoints[0].lng, instrAct.routes[0].routePoints[0].lat]]
									} else return [];
								})
							}
						}
					);

					return (
						<Mutation mutation={UPDATE_ROAD_CONDITION}>
							{(updateRoadCondition, callbackData) => (

								<div className='toolbox'>
									<p>Editing roadcondition: {this.props.id}</p>
									<RoadConditionToolbox id={this.props.id} data={data}
														  readOnly={this.props.readOnly}
														  handleData={(data) => this.handleData(updateRoadCondition, data)}/>
									{ !this.props.readOnly ? deleteButton : null }
								</div>
							)}
						</Mutation>
					)
				}}
			</Query>
		);
	}
}

export default UpdateRoadCondition;
