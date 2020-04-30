import * as React from 'react';
import Button from "react-bootstrap/Button";
import InstrumentToolbox from "./InstrumentToolbox";
import Name from "../../../components/other/Name";
import Description from "../../../components/other/Description";
import RouteToolbox from "./RouteToolbox";
import '../styles/instrumentActionToolbox.scss';
import {ApolloConsumer} from 'react-apollo';

type Props = {
	handleInstrumentActions: (newInstrumentsActions: any) => void
}

type State = {
	instrumentActions: InstrumentActions,
	instrument: { name: string, instrumentTypeID: number, location: [number, number], instrumentSystem: string, description: string },
	text: string,
	description: string,
	routes: { id: number, lng: number, lat: number }[],
	addNewInstrumentToggle: boolean
}

type InstrumentActions = {id: number, instrument: { name: string, instrumentTypeID: number, location: [number, number], instrumentSystem: string, description: string }, text: string, description: string,
	routes: { id: number, lng: number, lat: number }[]}[];

/*
	InstrumentActionToolbox component
	Used by [RoadConditionActionToolbox] in [Scenario-Designer]
	Shows corresponding input fields for an Instrument Action
	It passes: instrumentActions array to parent.
 */
class InstrumentActionToolbox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			instrumentActions: [],
			instrument: null,
			text: null,
			description: null,
			routes: [],
			addNewInstrumentToggle: false
		};
		this.addInstrumentAction = this.addInstrumentAction.bind(this);
		this.deleteInstrumentAction = this.deleteInstrumentAction.bind(this);
		this.handleInstrument = this.handleInstrument.bind(this);
		this.handleText = this.handleText.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleRoutes = this.handleRoutes.bind(this);
		this.sendData = this.sendData.bind(this);
	}

	handleInstrument(newInstrument: { name: string, instrumentTypeID: number, location: [number, number], instrumentSystem: string, description: string }) {
		this.setState({
			instrument: newInstrument
		});
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

	handleRoutes(newRoutes: { id: number, lng: number, lat: number }[]) {
		this.setState({
			routes: newRoutes
		})
	}

	/*
		Add an object to the array of instrumentActions
		Requires the instrument and text values to be defined.
	 */
	addInstrumentAction() {
		if (this.state.instrument !== null && this.state.text !== null) {
			let newInstrumentAction = {
				id: this.state.instrumentActions.length,
				instrument: this.state.instrument,
				text: this.state.text,
				description: this.state.description,
				routes: this.state.routes
			};
			let newInstrumentActions = [...this.state.instrumentActions, newInstrumentAction];
			this.setState({
				instrumentActions: newInstrumentActions
			});
			this.sendData();
		}
	}

	/*
		Delete object from the array of instrumentActions.
		Update the id's of the items after it, by subtracting 1.
	 */
	deleteInstrumentAction(instrumentActionID: number) {
		let newInstrumentActions = this.state.instrumentActions;
		newInstrumentActions.splice(instrumentActionID, 1);

		newInstrumentActions = newInstrumentActions.map((instrumentAction) => {
			if (instrumentAction.id > instrumentActionID) {
				return {...instrumentAction, id: instrumentAction.id - 1}
			} else {
				return instrumentAction
			}
		});

		this.setState({
			instrumentActions: newInstrumentActions
		});
		this.sendData();
	}

	sendData() {
		this.setState({
			addNewInstrumentToggle: false
		});
		const tempState = this.state;
		const { addNewInstrumentToggle, ...dataToSend } = tempState;
		this.props.handleInstrumentActions(dataToSend);
	}

	render() {
		let currentInstrumentActions = this.state.instrumentActions.map((instrumentAction) =>
			<div key={instrumentAction.id}>
				<span>{instrumentAction.text}</span>
				<span onClick={() => this.deleteInstrumentAction(instrumentAction.id)}>X</span>
			</div>
		);


		return (
			<div className="instrument-action">
				{currentInstrumentActions}
				{this.state.addNewInstrumentToggle ? (
					<div>
						<InstrumentToolbox handleInstrument={this.handleInstrument}/>
						<p>Instrument actie text:</p>
						<Name handleName={this.handleText} />
						<Description handleDescription={this.handleDescription}/>
						<p>Routes:</p>
						<RouteToolbox handleRoute={this.handleRoutes}/>
						<div className="add-new border-top">
							<div onClick={this.addInstrumentAction}>Voeg instrument toe</div>
						</div>
					</div>
				) : (
					<div className="add-new">
						<div onClick={() => this.setState({addNewInstrumentToggle: true})}>
							Voeg nieuw instrument toe
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default InstrumentActionToolbox;
