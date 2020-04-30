import * as React from 'react';
import '../styles/input.scss';

type State = {}

type Props = {
	selectedId?: number,
	disabled?: boolean,
	handleType: (id: number) => void,
	types: {id: string, name: string, description: string}[]
}

/*
	Input component: SelectAction Dropdown
	Used by [LeftPane] in [Scenario-Designer]
 */
class Type extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleType = this.handleType.bind(this);
	}

	handleType(e: React.ChangeEvent<HTMLSelectElement>) {
		this.props.handleType(parseInt(e.target.value));
	}

	render() {
		let items = this.props.types.map( (type) => <option disabled={this.props.disabled} value={type.id} key={type.name}>{type.name}</option> );

		return (
			<div className="input">
				<select value={this.props.selectedId} onChange={this.handleType}>
					<option disabled value={-1} key={undefined}>--</option>
					{items}
				</select>
			</div>
		);
	}
}

export default Type;
