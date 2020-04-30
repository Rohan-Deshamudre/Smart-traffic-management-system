import * as React from 'react';
import '../styles/input.scss';
import FormControl from "react-bootstrap/FormControl";


type State = {
	description: string
}

type Props = {
	description?: string,
	notOptional?: boolean
	disabled?: boolean,
	handleDescription: (name: string) => void
}

/*
	Input field for a [description].
	Used by: [Leftpane] in [Scenario-Designer].
 */
class Description extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.handleDescription = this.handleDescription.bind(this);
	}

	handleDescription(e: React.ChangeEvent<HTMLInputElement>) {
		this.props.handleDescription(e.target.value);
	}

	render() {
		return (
			<div className="input">
				<FormControl as="textarea" placeholder={"Omschrijving" + (this.props.notOptional ? null : " (optioneel)")} value={this.props.description}
							 className="description-input"
							 disabled={this.props.disabled}
							 onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.handleDescription(e)}/>
			</div>
		);
	}
}

export default Description;
