import * as React from 'react'
import '../styles/input.scss'
import '../styles/selectAction.scss'
import { Form } from "react-bootstrap"

type State = {}

type Props = {
	selectedIds: number[],
	handleActions: (ids: number[]) => void,
	options: any,
	disabled?: boolean
}

/*
	Input component: SelectAction Dropdown
	Used by [LeftPane] in [Scenario-Designer]
 */
class SelectAction extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleActions = this.handleActions.bind(this);
	}

	handleActions(e: React.ChangeEvent<HTMLSelectElement>, options) {
		let updatedId: number = parseInt(e.target.value);
		let updatedIds = this.props.selectedIds;

		updatedIds = updatedIds.filter(id => (
			id === updatedId || !options.includes(id)
		));

		if (updatedIds.includes(updatedId)) {
			updatedIds = updatedIds.filter(id => { return id != updatedId });
		} else {
			updatedIds.push(updatedId)
		}

		this.props.handleActions(updatedIds);
	}

	render() {
		let instruments = this.props.options.map(option => (
			<div key={option.id}>
				<p className="instrument-name">{option.name}</p>
				<Form className="select-input" >
				{
					option.instrumentActions.map( (action) => (
						<Form.Check
							custom
							inline
							className="select-option"
							label={action.text}
							value={action.id}
							key={action.id}
							type="checkbox"
							checked={this.props.selectedIds.includes(parseInt(action.id))}
							disabled={this.props.disabled}
							id={`custom-inline-${action.id}-1`}
							onChange={(e) => this.handleActions(e, option.instrumentActions.map((action) =>  parseInt(action.id)))}
						/>
					))
				}
				</Form>
			</div>
		));

		return (
			<div className="input select-action">
				{instruments}
			</div>
		);
	}
}

export default SelectAction;
