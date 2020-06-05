import * as React from 'react';
import {Mutation, Query} from 'react-apollo';
import {GET_TREE} from "../../../../components/workspaceData";
import {ADD_ROAD_SEGMENT} from "./RoadSegmentToolboxQueries";
import RoadSegmentToolbox from "./RoadSegmentToolbox";

type Props = {
	scenarioId: number,
	parentInfo: [number, string],
}

type State = {
	scenarioId: number,
}

/*
	AddRoadSegment component
	Used by [AddRoadSegment] in [Scenario-Designer]
	Shows corresponding input fields for a RoadSegment type in the decision tree
	It passes: state to parent.
 */
class AddRoadSegment extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			scenarioId: this.props.scenarioId
		};
		this.handleData = this.handleData.bind(this);

	}

	handleData(mutationFunction, newData) {
		mutationFunction({
			variables: {
				scenarioId: this.props.scenarioId,
				name: newData.name,
				roadSegmentTypeId: newData.roadSegmentTypeId,
				route: newData.route,
				alternativeRoute: newData.alternativeRoute
			},
			refetchQueries: [{ query: GET_TREE, variables: { id: this.props.scenarioId } }]
		})
	}

	render() {
		return (
			<Mutation mutation={ADD_ROAD_SEGMENT}>
				{(createRoadSegment, callbackData) => (
					<div className='toolbox'>
						<p>Mark problem area:</p>
						<RoadSegmentToolbox id={this.props.parentInfo[0]} handleData={(newData) => this.handleData(createRoadSegment, newData)}/>
					</div>
				)}
			</Mutation>
		)
	}
}


export default AddRoadSegment;
