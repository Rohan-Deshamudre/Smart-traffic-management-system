import * as React from 'react';
import '../styles/input.scss';
import FormControl from "react-bootstrap/FormControl";


type Props = {
	name?: string,
	disabled?: boolean
	handleName: (name: string) => void
}

type State = {}

/*
	Input field for a [name].
	Used by: [Leftpane] in [Scenario-Designer].
 */
class Name extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleName = this.handleName.bind(this);
	}


	handleName(e: React.ChangeEvent<HTMLInputElement>) {
		this.props.handleName(e.target.value);
	}

	render() {
		return (
			<div className="input">
				<FormControl type="text" placeholder="Naam" value={this.props.name} className="name-input"
							 onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleName(e)} disabled={this.props.disabled}/>
			</div>
		);
	}
}

export default Name;
