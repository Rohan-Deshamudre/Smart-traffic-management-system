import * as React from 'react';

import '../styles/leftPane.scss';
import '../styles/rightPane.scss';
import asInsightsPane from "../../../components/InsightsPane";
import SimulationItem from '../components/SimulationItem';
import { Query } from 'react-apollo';
import { GET_TREE } from '../../../components/workspaceData';
import { treeUtils } from "../../../components/tree/treeUtils";

import * as moment from 'moment';
import { GET_SIMULATION_FROM_SCENARIO } from "../SimulationQueries";
import SimulationList from "../components/SimulationList";

type Props = {
    messageSocket: Function;
    simulationLog: any;
}

class InsightsPane extends React.Component<Props, {}, any> {

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

    start(client, id, roadSegmentIds = []) {
        // First stop other streams
        client.writeData({ data: { simulating: true } });
        this.props.messageSocket(this.makeMessageObject(id, roadSegmentIds), "-- Simulatie gestart");
    };

    stop(client) {
        client.writeData({ data: { simulating: false } });
        const stopMsg = {
            'type': 1
        };
        this.props.messageSocket(JSON.stringify(stopMsg), "-- Simulatie gestopt")
    };


    render() {
        return (
            <div className="pane left-pane designer">
                <div className="pane-header">
                    <div className="d-block header-title">Insights</div>
                </div>

                <div className="bottom">
                    
                </div>
            </div>
        );
    }

}

export default asInsightsPane(InsightsPane);
