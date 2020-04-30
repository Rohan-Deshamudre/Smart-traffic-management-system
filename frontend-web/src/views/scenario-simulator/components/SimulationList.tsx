import * as React from 'react';
import "../styles/simulationItem.scss"

import {Query} from "react-apollo";
import {GET_SIMULATION_FROM_SCENARIO} from "../SimulationQueries";
import {GET_TREE} from "../../../components/workspaceData";
import {treeUtils} from "../../../components/tree/treeUtils";
import SimulationItem from "./SimulationItem";

type State = {
	currentlyPlaying: number
}

type Props = {
	scenarioId: number
	start: any
	stop: any
}

class SimulationList extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			currentlyPlaying: -2
		};

		this.playSimulation = this.playSimulation.bind(this);
		this.stopSimulation = this.stopSimulation.bind(this);
	}

	playSimulation(client, id, roadSegments = []) {
		this.props.stop(client);

		this.setState({
			currentlyPlaying: id
		});
		this.props.start(client, id, roadSegments);
	}

	stopSimulation(client, id) {
		this.setState({
			currentlyPlaying: -2
		});
		this.props.stop(client, id)
	}

	render() {
		let id = this.props.scenarioId;
		const liveSimulation = (
			<Query query={GET_TREE} variables={{id}} skip={!id}>
				{({loading, error, data, client}) => {
					if (loading) return <div>Fetching</div>;
					if (error) return <div>Error</div>;

					let liveSimulation = <div>Kan Scenario(id:{id ? id : 'null'}) niet live simuleren</div>;
					let roadSegments = [];
					if (data !== undefined) {
						let scenario = treeUtils.replaceChildrenKeys(data.scenarios[0]);
						if ('children' in scenario) {
							roadSegments = data.scenarios[0].children.map(x => x.id);
							liveSimulation = <SimulationItem scenarioId={id} id={-1} live={true} key={0} title={"Live"}
															 onStart={() => this.playSimulation(client, -1, roadSegments)}
															 onStop={() => this.stopSimulation(client, -1)}
															 active={-1 === this.state.currentlyPlaying}/>
						}
					}
					return (
						<div>
							{liveSimulation}
						</div>
					)
				}}
			</Query>
		);

		const savedSimulations = (
			<Query query={GET_SIMULATION_FROM_SCENARIO} variables={{id}} skip={!id}>
				{({loading, error, data, client}) => {
					if (loading) return <div>Fetching</div>;
					if (error) return <div>Error</div>;

					let specificCongetion = <div className="nothing-found-message">Geen opgeslagen simulaties
						gevonden</div>;
					if (data !== undefined && data.simulations.length > 0) {
						specificCongetion = data.simulations.map((x) =>
							<SimulationItem scenarioId={id} live={false} key={x.id} id={x.id} title={'Simulatie ' + x.id}
											startTime={x.startTime}
											endTime={x.endTime}
											onStart={() => this.playSimulation(client, x.id)}
											onStop={() => this.stopSimulation(client, x.id)}
											active={x.id === this.state.currentlyPlaying} />);
					}
					return (
						<div>
							{specificCongetion}
						</div>
					)
				}}
			</Query>
		);


		return (
			<div>
				<div className="right-pane-simulator-title">Simulatie Opties</div>
				{liveSimulation}
				{savedSimulations}
			</div>
		);
	}
}

export default SimulationList;
