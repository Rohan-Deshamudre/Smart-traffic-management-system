import * as React from 'react'
import asInsightsPane from '../../../components/InsightsPane';

import '../styles/InsightsPane';

import PaneBottomButtons from "../../../components/buttons/PaneBottomButtons";
import {ApolloConsumer} from "react-apollo";
import UpdateScenario from "../toolboxes/scenario/UpdateScenario";
import UpdateRoadSegment from "../toolboxes/road-segment/UpdateRoadSegment";
import AddRoadSegment from "../toolboxes/road-segment/AddRoadSegment";
import UpdateRoadCondition from "../toolboxes/road-condition/UpdateRoadCondition";
import UpdateRoadConditionAction from "../toolboxes/road-condition-action/UpdateRoadCondtionAction";
import AddRoadCondition from "../toolboxes/road-condition/AddRoadCondition";
import AddRoadConditionAction from "../toolboxes/road-condition-action/AddRoadConditionAction";
import { Image } from 'react-bootstrap';

type State = {
    type: string,
}

type Props = {
    active: boolean
    readOnly: boolean
    toggle: () => void
    data: {
        id: number
        value: string
        roadSegmentId: number
        roadConditionTypeId: number
        roadSegment: {
            id: number
            name: string
            roadSegmentType: {
                id: number
                name: string
                img: Image
                description: string
            }
        }
        roadConditionType: {
            id: number
            name: string
            img: Image
            description: string
        }
    }
}

class InsightsPane extends React.Component<Props, State, any> {
    constructor(props: Props) {
		super(props);
		this.state = {
			type: null
		};

		this.constructToolbox = this.constructToolbox.bind(this);
    }
    
    componentDidUpdate(
        prevProps: Readonly<Props>, 
        prevState: Readonly<State>, 
        snapshot?: any
    ): void {
		if ((prevProps.data.id !== this.props.data.id || prevProps.data.curNodeType) !== this.props.data.curNodeType && !this.props.active) {
			this.props.toggle();
		}
	}

	constructToolbox(data) {
		const insightsPaneData = data;
		switch (data.roadConditionTypeId) {
            // "ScenarioObjectType"
			case 0:
                return <UpdateScenario readOnly={this.props.readOnly} scenarioId={data.currentTreeId} id={data.curNodeId}/>;
            
            // "RoadSegmentObjectType"
			case 1:
				return data.id === -1 ? (
					<AddRoadSegment scenarioId={data.currentTreeId} parentInfo={data.parentInfo} />
				) : (
					<UpdateRoadSegment readOnly={this.props.readOnly} scenarioId={data.currentTreeId} id={data.curNodeId}/>
				);
            
            // "RoadConditionObjectType"
            case 2:
				return data.id === -1 ? (
					<AddRoadCondition scenarioId={data.currentTreeId} parentInfo={data.parentInfo}/>
				) : (
					<ApolloConsumer>
						{client => {
						return (<UpdateRoadCondition readOnly={this.props.readOnly} scenarioId={leftPaneData.currentTreeId} id={leftPaneData.curNodeId} client={client}/>)
						}}
					</ApolloConsumer>
                );
                
            // "RoadConditionActionObjectType"
			case 3:
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
			<div className="pane insights-pane designer">
				<div className="pane-header">
					<div className="d-block header-title">Insights</div>
				</div>


				<div className="body-insights-pane-designer">
					{this.constructToolbox(data)}
				</div>

				<PaneBottomButtons middleButtonURL={"Show insights!"}/>
			</div>
		);
	}
}

export default asInsightsPane(InsightsPane);