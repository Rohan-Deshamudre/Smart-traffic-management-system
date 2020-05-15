import * as React from 'react';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import LeftPane from "../scenario-designer/modules/LeftPane";
import RightPane from "./modules/RightPane";
import { ApolloConsumer, Query } from 'react-apollo';
import { GET_WORKSPACE_DATA, GET_TREE } from '../../components/workspaceData';
import * as moment from 'moment';

// @ts-ignore
import simulationIcon from '../../assets/node_icons/simulations.svg';
// @ts-ignore
import editorIcon from "./../../assets/node_icons/designer.svg";
import { GET_DESIGNER_DATA } from "../scenario-designer/ScenarioDesigner";
import { Auth } from '../../helper/auth';

interface State {
	leftPaneActive: boolean;
	rightPaneActive: boolean;
	simulationStatus: any;
	simulationLog: any;
}

interface Props {
}


class ScenarioSimulator extends React.Component<Props, State> {
	ws = new WebSocket(process.env.SIMULATION_URL);
	private GET_DESIGNER_DATA: any;

	constructor(props: Props) {
		super(props);
		this.state = {
			leftPaneActive: false,
			rightPaneActive: true,
			simulationStatus: {},
			simulationLog: []
		};

		this.toggleLeftPane = this.toggleLeftPane.bind(this);
		this.toggleRightPane = this.toggleRightPane.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.componentWillUnmount = this.componentWillUnmount.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.replaceLiveId = this.replaceLiveId.bind(this);
	}

	componentDidMount() {
		this.ws.onopen = () => {
			this.setState({
				simulationLog: [{ time: 'Systeem', text: "Connectie gemaakt" }]
			})
		};

		this.ws.onmessage = evt => {
			const message = JSON.parse(evt.data);
			if (!message['text']) {
				this.setState({
					simulationStatus: message.id == -1 ? this.replaceLiveId(message) : message,
					simulationLog: [...this.state.simulationLog, { time: moment(message.time).format('HH:mm:ss'), simulationSceneEvents: message.simulationSceneEvents }]
				})
			} else if (message.text === "DISC OK") {
				this.setState({
					// simulationLog: [...this.state.simulationLog, {time: 'System', text: 'Verbinding stopgezet'} ]
				})
			} else if (message.text === "CON OK") {
				this.setState({
					// simulationLog: [...this.state.simulationLog, {time: 'System', text: 'Verbinding gestart'} ]
				})
			}
		};

		this.ws.onclose = () => {
			this.setState({
				simulationLog: [...this.state.simulationLog, { time: 'Systeem', text: "Connectie verbroken" }]
			});
		};
	}

	componentWillUnmount() {
		this.ws.close();
	}

	sendMessage(message, description = "Ongespecificeerd bericht naar de server") {
		this.setState({
			simulationLog: [...this.state.simulationLog, { time: 'Systeem', text: description }]
		});
		this.ws.send(message);
	}

	toggleLeftPane() {
		this.setState({
			leftPaneActive: !this.state.leftPaneActive
		})
	}

	toggleRightPane() {
		this.setState({
			rightPaneActive: !this.state.rightPaneActive
		})
	}

	replaceLiveId(message) {
		if (message.simulationSceneEvents !== undefined) {
			let i = 0;
			message.simulationSceneEvents = message.simulationSceneEvents.map(event => ({ ...event, id: i++ }));
		}
		return message;
	}

	/** This is similar to ScenarioDesigner but takes the simulation status, log into account */
	render() {
		return (
			<div className="view scenario-simulator-view">
				<NavBar mode="ScenarioSimulator" />

				<div className="home-container structure-container">
					{Auth.isEngineer() ?
						<Query query={GET_DESIGNER_DATA}>
							{
								({ data }) => (
									<LeftPane paneName="Designer"
										readOnly
										icon={editorIcon}
										toggle={this.toggleLeftPane}
										data={data}
										active={this.state.leftPaneActive}
									/>
								)
							}
						</Query>
						: null}
					<ApolloConsumer>
						{client =>
							<Workspace rightPaneActive={this.state.rightPaneActive}
								simulationStatus={this.state.simulationStatus}
								client={client}
							/>
						}
					</ApolloConsumer>

					<Query query={GET_WORKSPACE_DATA}>
						{
							({ loading, error, data }) => {
								if (loading) return <div className="container-center"><div className="loader"></div></div>;
								if (error) {
									console.log(error)
									return <div>Error</div>;
								}

								const id = data.currentTreeId;
								return (
									<RightPane paneName="Simulaties"
										icon={simulationIcon}
										toggle={this.toggleRightPane}
										active={this.state.rightPaneActive}
										simulationLog={this.state.simulationLog}
										messageSocket={this.sendMessage}
										scenarioId={id}
									/>
								);
							}
						}
					</Query>

				</div>
			</div>
		);
	}
}

export default ScenarioSimulator;
