import * as React from 'react';
import asLeftPane from "../../../components/LeftPane";

import '../styles/leftPane.scss';

import PaneBottomButtons from "../../../components/buttons/PaneBottomButtons";
import UpdateScenario from "../toolboxes/scenario/UpdateScenario";
import {ApolloConsumer} from "react-apollo";
import UpdateRoadSegment from "../toolboxes/road-segment/UpdateRoadSegment";
import AddRoadSegment from "../toolboxes/road-segment/AddRoadSegment";
import UpdateRoadCondition from "../toolboxes/road-condition/UpdateRoadCondition";
import UpdateRoadConditionAction from "../toolboxes/road-condition-action/UpdateRoadCondtionAction";
import AddRoadCondition from "../toolboxes/road-condition/AddRoadCondition";
import AddRoadConditionAction from "../toolboxes/road-condition-action/AddRoadConditionAction";
import asDesignerPane from "../../../components/DesignerPane";

type State = {
	type: string,
}

type Props = {
	active: boolean
	readOnly: boolean
	toggle: () => void
	data: {
		curNodeId: number
		curNodeType: string
		parentInfo: [number, string]
		currentTreeId: number
	}
}

class LeftPane extends React.Component<Props, State, any> {
	constructor(props: Props) {
		super(props);
		this.state = {
			type: null
		};

		this.constructToolbox = this.constructToolbox.bind(this);
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
		if ((prevProps.data.curNodeId !== this.props.data.curNodeId || prevProps.data.curNodeType) !== this.props.data.curNodeType && !this.props.active) {
			this.props.toggle();
		}
	}

	constructToolbox(data) {
		const leftPaneData = data;
		switch (data.curNodeType) {
			case "ScenarioObjectType":
				return <UpdateScenario readOnly={this.props.readOnly} scenarioId={data.currentTreeId} id={data.curNodeId}/>;
			case "RoadSegmentObjectType":
				return data.curNodeId === -1 ? (
					<AddRoadSegment scenarioId={data.currentTreeId} parentInfo={data.parentInfo}/>
				) : (
					<UpdateRoadSegment readOnly={this.props.readOnly} scenarioId={data.currentTreeId} id={data.curNodeId}/>
				);
			case "RoadConditionObjectType":
				return data.curNodeId === -1 ? (
					<AddRoadCondition scenarioId={data.currentTreeId} parentInfo={data.parentInfo}/>
				) : (
					<ApolloConsumer>
						{client => {
						return (<UpdateRoadCondition readOnly={this.props.readOnly} scenarioId={leftPaneData.currentTreeId} id={leftPaneData.curNodeId} client={client}/>)
						}}
					</ApolloConsumer>
				);
			case "RoadConditionActionObjectType":
				return data.curNodeId === -1 ? (
					<AddRoadConditionAction scenarioId={data.currentTreeId} parentInfo={data.parentInfo}/>
				) : (
					<UpdateRoadConditionAction readOnly={this.props.readOnly} scenarioId={data.currentTreeId} id={data.curNodeId}/>
				);
			default:
				return (
					<div className="default-designer-info">Selecteer een node om te bewerken</div>
				);
		}
	}

	render() {

		let {data} = this.props;
		return (
			<div className="pane left-pane designer">
				<div className="pane-header">
					<div className="d-block header-title">Scenario Designer</div>
				</div>


				<div className="body-left-pane-designer">
					{this.constructToolbox(data)}
				</div>

				<PaneBottomButtons middleButtonURL={"simulator"}/>
			</div>
		);
	}
}

export default asDesignerPane(LeftPane);
