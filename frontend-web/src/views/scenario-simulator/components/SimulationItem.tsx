import * as React from 'react';
import "../styles/simulationItem.scss"
import { Mutation } from "react-apollo";

// @ts-ignore
import playButton from "./../../../assets/play.svg";
// @ts-ignore
import pauseButton from "./../../../assets/pause.svg";
// @ts-ignore
import bin from "./../../../assets/bin.svg";

import {DELETE_SIMULATION, GET_SIMULATION_FROM_SCENARIO} from "../SimulationQueries";
import {GET_TREE} from "../../../components/workspaceData";
import * as moment from "moment";

type State = {
	playing: boolean
}

type Props = {
	id: number
	scenarioId: number
	active: boolean
	live: boolean
	title: string
	onStart: any
	onStop: any
	startTime?: string,
	endTime?: string
}

class SimulationItem extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		let id = this.props.id;

		let deleteButton = (id) => (
			<Mutation mutation={DELETE_SIMULATION}>
				{(deleteSimulation) => (
					<img src={bin}
						 className="sim-button-icon delete-button-icon"
						 onClick={() => deleteSimulation({
							 variables: {
								 id: id
							 },
							 refetchQueries: [{ query: GET_SIMULATION_FROM_SCENARIO, variables: { id: this.props.scenarioId } }]
						 })}
						 alt="x"
					/>
				)}
			</Mutation>
		);

		return (
			<div className="d-flex justify-content-center w-100">
				<div className={this.props.live ? "simulator-button live-button" : "simulator-button"}>
					<img src={this.props.active ? pauseButton : playButton}
						 className="sim-button-icon play-button-icon"
						 onClick={() => {
								this.props.active ? this.props.onStop() : this.props.onStart();
							}}
						 alt="play/pause"/>
					{ this.props.title }
					{this.props.live ? null : deleteButton(id)}
					{this.props.live ? null :
							<div className="simulation-duration-info">
								<div
									className="simulation-time simulation-starttime">Van <span className="timestamp">{moment(this.props.startTime).format('h:mm:ss DD-MM-YY')}</span></div>
								<div
									className="simulation-time simulation-endtime">Tot <span className="timestamp">{moment(this.props.endTime).format('h:mm:ss DD-MM-YY')}</span></div>
							</div>}
				</div>
			</div>
		);
	}
}

export default SimulationItem;
