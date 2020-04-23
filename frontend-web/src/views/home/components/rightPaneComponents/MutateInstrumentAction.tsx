import * as React from "react";

import {
	CREATE_INSTRUMENT_ACTION, READ_FOLDERS, UPDATE_INSTRUMENT,
	UPDATE_INSTRUMENT_ACTION
} from "../../../../components/CRUDFolders";
import Name from "../../../../components/other/Name";
import {Mutation, ApolloConsumer} from "react-apollo";
import Description from "../../../../components/other/Description";
import Button from "react-bootstrap/Button";

import '../../styles/instrument.scss';
import RouteToolbox from "../../../scenario-designer/toolboxes/RouteToolbox";

// @ts-ignore
import deleteIcon from "./../../../../assets/bin.svg";
// @ts-ignore
import dripIcon from "./../../../../assets/drip.png";

type Props = {
	instrumentId: number,
	handleInstrumentAction: () => void
	description?: string,
	text?: string,
	routes?: any
	id?: number
	type: string
}

type State = {
	instrumentId: number,
	description: string,
	text: string,
	currentRoute: { id: number, lng: number, lat: number }[],
	routes: { lng: number, lat: number }[][]
}

class MutateInstrumentAction extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			instrumentId: this.props.instrumentId,
			description: this.props.description !== undefined ? this.props.description : '',
			text: this.props.text !== undefined ? this.props.text : '',
			currentRoute: [],
			routes: this.props.routes !== undefined ? this.props.routes : []
		};
		this.handleText = this.handleText.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleRoute = this.handleRoute.bind(this);
	}

	handleText(newText: string) {
		this.setState({
			text: newText
		})
	}

	handleDescription(newDescription: string) {
		this.setState({

			description: newDescription

		})
	}

	handleRoute(newRoute: { id: number, lng: number, lat: number }[]) {
		this.setState({
			currentRoute: newRoute
		})
	}

	render() {
		let currentRoutes = this.state.routes.map((route, index) => (
			<div key={index} className="d-flex justify-content-between align-items-center routes">
				<span>Route {index}</span>
				<img src={deleteIcon} alt="Delete Icon" className="delete"
					 onClick={() => this.setState({routes: this.state.routes.filter((filterRoute, filterIndex) => filterIndex !== index)})}/>
			</div>
		));


		return (
			<Mutation mutation={this.props.text ? UPDATE_INSTRUMENT_ACTION : CREATE_INSTRUMENT_ACTION}>
				{(mutateInstrument) => (
					<div className="mutate-instrument-action">
						<div className="d-flex flex-column">

							<div className="d-flex justify-content-end">
								<span onClick={this.props.handleInstrumentAction}>x</span>
							</div>

							{this.props.type === '1' &&
							<div className="drip-wrapper">
								<img src={dripIcon} alt="Drip Icon" className="drip-image"/>
								<span className="drip-text">{this.state.text}</span>
							</div>
							}

							<span>Text</span>
							<Name name={this.state.text} handleName={this.handleText}/>

							<span>Omschrijving</span>
							<Description description={this.state.description}
										 handleDescription={this.handleDescription}/>

							<span>Routes</span>
							{currentRoutes}
							<ApolloConsumer>
								{client => (
									<RouteToolbox client={client} route={this.state.currentRoute} handleRoute={this.handleRoute}/>
								)}
							</ApolloConsumer>
							<Button className="submit-button" disabled={this.state.currentRoute.length === 0}
									onClick={() => this.setState({
										routes: [...this.state.routes, this.state.currentRoute.map((currRoute: any) => ({
											lng: currRoute.lng,
											lat: currRoute.lat
										}))], currentRoute: []
									})}>Add Route</Button>

						</div>
						<Button type="submit" className="submit-button"
								disabled={this.state.text === ''}
								onClick={() => {
									if (!this.props.text) {
										mutateInstrument({
											variables: {
												instrumentId: this.state.instrumentId,
												description: this.state.description,
												text: this.state.text,
												routes: this.state.routes
											},
											refetchQueries: [{query: READ_FOLDERS}]
										});
									} else {
										mutateInstrument({
											variables: {
												newId: this.props.id,
												description: this.state.description,
												text: this.state.text,
												routes: this.state.routes
											},
											refetchQueries: [{query: READ_FOLDERS}]
										});
									}
									this.props.handleInstrumentAction();
								}}>{this.props.text ? 'Sla actie op' : 'Creëer instrument actie'}</Button>
					</div>
				)}
			</Mutation>
		)
	}
}

export default MutateInstrumentAction;