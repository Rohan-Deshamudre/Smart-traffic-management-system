import * as React from 'react';
import asRightPane from "../../../components/RightPane";
import "../styles/rightPane.scss";
import SimulationItem from '../components/SimulationItem';
import { Query } from 'react-apollo';
import { GET_TREE } from '../../../components/workspaceData';
import {treeUtils} from "../../../components/tree/treeUtils";
import Log from "../components/Log";
import * as moment from 'moment';
import {GET_SIMULATION_FROM_SCENARIO} from "../SimulationQueries";
import SimulationList from "../components/SimulationList";


type Props = {
	messageSocket: Function;
	scenarioId: number;
	simulationLog: any;
}


class RightPane extends React.Component<Props, {}, any> {

	constructor(props: Props) {
		super(props);
		this.start = this.start.bind(this);
		this.makeMessageObject = this.makeMessageObject.bind(this);
		this.stop = this.stop.bind(this);
	}

	makeMessageObject = (id, roadSegmentIds) => {
		const startObj = {
			'type': 0,
			'simulation_id': (id > 0) ? parseInt(id) : 'live',
			'road_segments': (id > 0) ? [] : roadSegmentIds
		};
		return JSON.stringify(startObj)
	};

	start(client, id, roadSegmentIds=[])  {
		// First stop other streams
		client.writeData({data: {simulating: true}});
		this.props.messageSocket(this.makeMessageObject(id,roadSegmentIds), "-- Simulatie gestart");
	};

	stop(client) {
		client.writeData({data: {simulating: false}});
		const stopMsg = {
			'type': 1
		};
		this.props.messageSocket(JSON.stringify(stopMsg), "-- Simulatie gestopt")
	};


    render() {
        return (
            <div className="pane right-pane simulator">
				<div className="top">
					<SimulationList scenarioId={this.props.scenarioId} 
									start={this.start} 
									stop={this.stop} 
					/>
				</div>
				<div className="bottom">
					<Log simulationLog={this.props.simulationLog}/>
				</div>
            </div>
        );
    }
}

export default asRightPane(RightPane);
