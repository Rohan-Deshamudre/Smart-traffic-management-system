import * as React from 'react';
import LocationSelector from "../../../components/map/LocationSelector";
import Name from "../../../components/other/Name";
import Type from "../../../components/other/Type";
import Description from "../../../components/other/Description";

type Props = {
	handleInstrument: (handleInstrument: State) => void
}

type State = {
	name: string,
	instrumentTypeID: number,
	location: [number, number],
	instrumentSystem: string,
	description: string
}


const instrumentTypesMock = [
	{
		id: '1',
		name: 'SelectAction 1 Road Condition',
		description: 'SelectAction 1 Descr'
	},
	{
		id: '2',
		name: 'SelectAction 2 Road Condition',
		description: 'SelectAction 2 Descr'
	}, {
		id: '3',
		name: 'SelectAction 3 Road Condition',
		description: 'SelectAction 3 Descr'
	}
];

/*
	InstrumentToolbox component
	Used by [InstrumentActionToolbox] in [Scenario-Designer]
	Shows corresponding input fields for an Instrument
	It passes: state to parent.
 */
class InstrumentToolbox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			name: null,
			instrumentTypeID: null,
			location: [null, null],
			instrumentSystem: null,
			description: null
		};

		this.handleName = this.handleName.bind(this);
		this.handleInstrumentType = this.handleInstrumentType.bind(this);
		this.handleLocation = this.handleLocation.bind(this);
		this.handleInstrumentSystem = this.handleInstrumentSystem.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.addInstrument = this.addInstrument.bind(this);

	}

	handleName(newName: string) {
		this.setState({
			name: newName
		});
		this.props.handleInstrument({...this.state, name: newName});
	}

	handleInstrumentType(newInstrumentTypeID: number) {
		this.setState({
			instrumentTypeID: newInstrumentTypeID
		});
		this.props.handleInstrument({...this.state, instrumentTypeID: newInstrumentTypeID});
	}

	handleLocation(newLocation: [number, number]) {
		this.setState({
			location: newLocation
		});
		this.props.handleInstrument({...this.state, location: newLocation});
	}

	handleInstrumentSystem(newInstrumentSystem: string) {
		this.setState({
			instrumentSystem: newInstrumentSystem
		});
		this.props.handleInstrument({...this.state, instrumentSystem: newInstrumentSystem});
	}

	handleDescription(newDescription: string) {
		this.setState({
			description: newDescription
		});
		this.props.handleInstrument({...this.state, description: newDescription});
	}

	addInstrument() {
	}

	render() {
		return (
			<div className="instrument-toolbox">
				<p>Voeg nieuw instrument toe:</p>
				<Name handleName={this.handleName}/>
				<Type handleType={this.handleInstrumentType} types={instrumentTypesMock}/>
				<LocationSelector handleLocation={this.handleLocation}/>
				<p>Instrument System:</p>
				<Name handleName={this.handleInstrumentSystem}/>
				<Description handleDescription={this.handleDescription}/>
			</div>
		);
	}
}

export default InstrumentToolbox;
