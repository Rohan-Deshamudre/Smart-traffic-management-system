import * as React from 'react';
import '../styles/specificCongestion.scss';
import LocationSelector from "../../../components/map/LocationSelector";
import FormControl from "react-bootstrap/FormControl";
import CongestionLevelButton from "../../../components/buttons/CongestionLevelButton";
import Button from "react-bootstrap/Button";

type SCState = {
	startLocation: [number, number],
	endLocation: [number, number],
	startTime: string,
	endTime: string,
	congestionLevel: number
}

type SCProps = {}

class SpecificCongestion extends React.Component<SCProps, SCState> {
	constructor(props: SCProps) {
		super(props);
		this.state = {
			startLocation: [0, 0],
			endLocation: [0, 0],
			startTime: '',
			endTime: '',
			congestionLevel: 0
		};

		this.handleStartLocation = this.handleStartLocation.bind(this);
		this.handleEndLocation = this.handleEndLocation.bind(this);
		this.handleStartTime = this.handleStartTime.bind(this);
		this.handleEndTime = this.handleEndTime.bind(this);
		this.handleCongestionLevel = this.handleCongestionLevel.bind(this);
	}

	handleStartLocation(newStartLocation: [number, number]) {
		this.setState({startLocation: newStartLocation});
	}

	handleEndLocation(newEndLocation: [number, number]) {
		this.setState({endLocation: newEndLocation});
	}

	handleStartTime(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({startTime: event.target.value});
	}

	handleEndTime(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({endTime: event.target.value});
	}

	handleCongestionLevel(a: number) {
		this.setState({congestionLevel: a});
	}

	render() {

		return (
			<div className="d-flex justify-content-center mt-3">
				<div className="specific-congestion">
					<LocationSelector handleLocation={this.handleStartLocation}/>
					<LocationSelector handleLocation={this.handleEndLocation} />
					<div className="d-flex justify-content-between van-tot align-items-center">
						<span>Van:</span>
						<FormControl type="time" placeholder="00:00" className="time" onChange={this.handleStartTime}/>
						<span>Tot:</span>
						<FormControl type="time" placeholder="00:00" className="time" onChange={this.handleEndTime}/>
					</div>
					<div className="border-bottom-black">
						<span>Congestie niveau</span>
						<CongestionLevelButton handleCongestionLevel={this.handleCongestionLevel} />
					</div>
					<div className="d-flex p-3 justify-content-center align-items-center">
						<Button className="add-button">Voeg toe</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default SpecificCongestion;
