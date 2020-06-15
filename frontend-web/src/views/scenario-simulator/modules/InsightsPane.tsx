import * as React from 'react';

import '../styles/leftPane.scss';
import '../styles/rightPane.scss';
import asInsightsPane from "../../../components/InsightsPane";
import InsightsLog from "../components/InsightsLog";


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
        this.props.messageSocket(this.makeMessageObject(id, roadSegmentIds), "Start!");
    };

    stop(client) {
        client.writeData({ data: { simulating: false } });
        const stopMsg = {
            'type': 1
        };
        this.props.messageSocket(JSON.stringify(stopMsg), "Stop!")
    };


    render() {
        return (
            <div className="pane left-pane designer">
                <div className="pane-header">
                    <div className="d-block header-title">Insights</div>
                </div>

                <div className="mid">
                    <p>
                        The insights provide a visual overview of the simulation process and generates
                        numerical data on the active response plans. As such, we provide insights on condition
                        values such as traffic intensity and speed.
                    </p>
                    <p>
                        Knowing the effect of the conditions will assist the driver in taking the alternative
                        advised to them, which will ensure they reach their destination via a different route.
                    </p>
                </div>

                <div className="bottom">
                    <InsightsLog simulationLog={this.props.simulationLog} />
                </div>
            </div>
        );
    }
}

export default asInsightsPane(InsightsPane);
