import * as React from 'react';
import asInsightsPane from "../../../components/InsightsPane";
import "../styles/insightsPane.scss";

import SimulationList from "../components/SimulationList";

type Props = {
    messageSocket: Function;
	scenarioId: number;
    simulationLog: any;
    data: any;
}

class InsightsPane extends React.Component<Props, {}, any> {
    constructor(props: Props) {
        super(props);
        //
    }

    render() {
        return (
            <div className="pane insights-pane simulator">
				
			</div>
        );
    }
}
