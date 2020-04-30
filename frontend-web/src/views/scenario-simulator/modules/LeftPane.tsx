import * as React from 'react';

import '../styles/leftPane.scss';

import FormControl from "react-bootstrap/FormControl";

import asLeftPane from "../../../components/LeftPane";
import CongestionLevelButton from "../../../components/buttons/CongestionLevelButton";
import PaneBottomButtons from "../../../components/buttons/PaneBottomButtons";
import SpecificCongestion from '../components/SpecificCongestion';

type LPState = {
	time: string,
	congestionLevel: number,
	data: any
}

type LPProps = {}

class LeftPane extends React.Component<LPProps, LPState, any> {
	constructor(props: LPProps) {
		super(props);
		this.state = {
			time: '',
			congestionLevel: 0,
			data: {}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleCongestionLevel = this.handleCongestionLevel.bind(this);
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({time: event.target.value});
	}

	handleCongestionLevel(newCongestionLevel: number) {
		this.setState({congestionLevel: newCongestionLevel});
	}

	render() {

		return (
			<div className="pane left-pane simulator">
				<div className="title-left-pane">Scenario Simulator</div>

				<span className="mt-3">Tijd:</span>
				<FormControl type="time" placeholder="00:00" className="time w-50 mb-3" value={this.state.time}
							 onChange={this.handleChange}/>

				<span>Algeheel congestie niveau:</span>
				<CongestionLevelButton handleCongestionLevel={this.handleCongestionLevel} />

				<span>Creëer specifieke congestie:</span>
				<SpecificCongestion/>

				<PaneBottomButtons middleButtonURL={"simuleer"} />
			</div>
		);
	}
}

export default asLeftPane(LeftPane);
