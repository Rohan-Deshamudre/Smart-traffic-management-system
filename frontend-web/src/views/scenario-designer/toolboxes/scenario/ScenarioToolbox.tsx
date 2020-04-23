import * as React from 'react';
import Name from "../../../../components/other/Name";
import Description from "../../../../components/other/Description";
import LocationSelector from "../../../../components/map/LocationSelector";
import Button from "react-bootstrap/Button";
import '../../styles/toolbox.scss';

type Props = {
	data?: any,
	handleData: (newData: any) => void
	disabled?: boolean
}

type State = {
	name: string,
	description: string,
	location: [number, number],
	saved: boolean,
	disabled: boolean,
}

/*
	ScenarioToolbox component
	Used by [LeftPane] in [Scenario-Designer]
	Shows corresponding input fields for a Scenario type in the decision tree
	It passes: state to parent.
 */
class ScenarioToolbox extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			location: [null, null],
			saved: true,
			disabled: true
		};

		if (this.props.data !== undefined) {
			let { data } = this.props;

			this.state = {
				...this.state,
				name: data.scenarios[0].name,
				description: data.scenarios[0].description
			}
		}

		this.handleName = this.handleName.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleLocation = this.handleLocation.bind(this);
		this.handleData = this.handleData.bind(this);
	}

	handleName(newName: string) {
		this.setState({
			saved: false,
			name: newName
		}, () => this.disabled());
	}

	handleDescription(newDescription: string) {
		this.setState({
			saved: false,
			description: newDescription
		}, () => this.disabled());
	}

	handleLocation(newLocation: [number, number]) {
		this.setState({
			saved: false,
			location: newLocation
		}, () => this.disabled());
	}

	handleData() {
		this.props.handleData({
			name: this.state.name,
			disabled: false,
			description: this.state.description
		});
	}

	disabled() {
		this.setState({
			disabled: this.state.name === ''
		})
	}

	render() {
		const disabled = this.state.disabled ? ' disabled' : '';
		const success = this.state.saved ? ' btn-success' : '';

		return (
			<div className='toolbox'>
				<Name name={this.state.name} handleName={this.handleName} disabled={this.props.disabled}/>
				<Description description={this.state.description} handleDescription={this.handleDescription} disabled={this.props.disabled}/>
				{!this.props.disabled && (
					<Button className={"opslaan-button" + disabled + success} onClick={() => {
						if (!this.state.saved && !this.state.disabled) {
							this.setState({ saved: true, disabled: true });
							this.handleData();
						}
					}}>
						{this.state.saved ? "Opgeslagen!" : "Item opslaan"}
					</Button>
				)}
			</div>
		);
	}
}

export default ScenarioToolbox;
