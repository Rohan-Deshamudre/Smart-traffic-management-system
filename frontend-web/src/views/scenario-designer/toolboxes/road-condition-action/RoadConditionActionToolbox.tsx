import * as React from 'react';
import Name from "../../../../components/other/Name";
import Button from "react-bootstrap/Button";
import Description from "../../../../components/other/Description";
import '../../styles/toolbox.scss';
import {Mutation, Query} from "react-apollo";

import {
	GET_CONSTRAINT_TYPES,
	GET_INSTRUMENT_ACTIONS,
	GET_INSTRUMENT_SYSTEM_TYPES, GET_INSTRUMENTS,
	GET_ROAD_CONDITION_ACTION_GOAL_TYPES
} from "./RoadConditionActionToolboxQueries";
import SelectAction from "../../../../components/other/SelectAction";
import Type from "../../../../components/other/Type";


type Props = {
	id: number,
	data?: any,
	handleData: (newData: any) => void,
	readOnly?: boolean
}

type State = {
	actionName: string,
	description: string,
	constraintName: string,
	constraintTypeId: number,
	instrumentActionIds: number[],
	instrumentSystemId: number,
	roadConditionActionGoalId: number,
	saved: boolean,
	disabled: boolean
}

/*
	RoadConditionActionToolbox component
	Used by [RoadConditionActionToolbox] in [Scenario-Designer]
	Shows corresponding input fields for a Action type in the decision tree
	It passes: state to parent.
 */
class RoadConditionActionToolbox extends React.Component<Props, State> {
	baseState: State = {
		actionName: '',
		description: '',
		constraintName: '',
		instrumentActionIds: [],
		instrumentSystemId: -1,
		roadConditionActionGoalId: -1,
		constraintTypeId: -1,
		saved: true,
		disabled: true
	};

	constructor(props: Props) {
		super(props);
		this.state = this.baseState;

		if (this.props.data !== undefined) {
			let data = this.props.data.roadConditionActions[0];
			this.state = {
				...this.state,
				actionName: data.actionName,
				description: data.description,
				constraintName: data.constraint.name,
				constraintTypeId: data.constraint.constraintType.id,
				instrumentActionIds: data.instrumentActions.map(instrument => parseInt(instrument.id)),
				roadConditionActionGoalId: parseInt(data.roadConditionActionGoal.id),
				instrumentSystemId: parseInt(data.instrumentSystem.id)
			}
		}

		this.handleData = this.handleData.bind(this);
		this.handleInstrumentSystemId = this.handleInstrumentSystemId.bind(this);
		this.handleRoadConditionActionGoalId = this.handleRoadConditionActionGoalId.bind(this);
		this.handleConstraintTypeId = this.handleConstraintTypeId.bind(this);
		this.handleActionName = this.handleActionName.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleConstraint = this.handleConstraint.bind(this);
		this.handleInstrumentActionIds = this.handleInstrumentActionIds.bind(this);
		this.disabled = this.disabled.bind(this);
	}

	componentDidUpdate(prevProps: Props) {
		if(this.props.id !== prevProps.id && this.props.data === undefined) {
			this.setState({
				...this.baseState
			})
		}
	}

	resetState() {
		if(this.props.data === undefined) {
			this.setState({
				...this.baseState
			})
		} else {
			this.setState({
				saved: true,
				disabled: true
			})
		}
	}

	handleData() {
		this.props.handleData(this.state);
	}

	handleInstrumentSystemId(id: number) {
		this.setState({
			saved: false,
			instrumentSystemId: id
		}, () => this.disabled());
	}

	handleRoadConditionActionGoalId(id: number) {
		this.setState({
			saved: false,
			roadConditionActionGoalId: id
		}, () => this.disabled());
	}

	handleActionName(newName: string) {
		this.setState({
			saved: false,
			actionName: newName
		}, () => this.disabled());
	}

	handleDescription(newDescription: string) {
		this.setState({
			saved: false,
			description: newDescription
		}, () => this.disabled());
	}

	handleConstraint(newConstraint: string) {
		this.setState({
			saved: false,
			constraintName: newConstraint
		}, () => this.disabled());
	}

	handleConstraintTypeId(newConstraintId: number) {
		this.setState({
			saved: false,
			constraintTypeId: newConstraintId
		}, () => this.disabled());
	}

	handleInstrumentActionIds(ids: number[]) {
		this.setState({
			saved: false,
			instrumentActionIds: ids
		}, () => this.disabled());
	}

	disabled() {
		this.setState({
			disabled: (
				this.state.actionName === ""
				|| this.state.instrumentSystemId < 0
				|| this.state.roadConditionActionGoalId < 0
				|| this.state.constraintTypeId < 0
				|| this.state.instrumentActionIds === undefined
				|| this.state.constraintName === ""
			)
		})
	}

	render() {
		const disabled = this.state.disabled ? ' disabled' : '';
		const success = this.state.saved ? ' btn-success' : '';
		const instrumentSystemId = this.state.instrumentSystemId;

		const instrumentSystemTypes = (
			<Query query={GET_INSTRUMENT_SYSTEM_TYPES}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Type selectedId={this.state.instrumentSystemId}
							  disabled={this.props.readOnly}
							  types={data.instrumentSystems} handleType={this.handleInstrumentSystemId}/>
					);
				}}
			</Query>
		);

		const actionSelector = (
			<Query query={GET_INSTRUMENTS} variables={{instrumentSystemId}}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<SelectAction
							disabled={this.props.readOnly}
							selectedIds={this.state.instrumentActionIds}
							options={data.instruments}
							handleActions={this.handleInstrumentActionIds}/>
					);
				}}
			</Query>
		);

		const roadConditionActionTypes = (
			<Query query={GET_ROAD_CONDITION_ACTION_GOAL_TYPES}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Type selectedId={this.state.roadConditionActionGoalId}
							  disabled={this.props.readOnly}
							  types={data.roadConditionActionGoals}
							  handleType={this.handleRoadConditionActionGoalId}/>
					);
				}}
			</Query>
		);

		const constraintTypes = (
			<Query query={GET_CONSTRAINT_TYPES}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Type selectedId={this.state.constraintTypeId}
							  types={data.roadConditionActionConstraintTypes}
							  disabled={this.props.readOnly}
							  handleType={this.handleConstraintTypeId}/>
					);
				}}
			</Query>
		);

		return (
			<div className='toolbox'>
				<p>Action:</p>
				<Name name={this.state.actionName}
					  disabled={this.props.readOnly}
					  handleName={this.handleActionName}/>
				<Description description={this.state.description}
							 disabled={this.props.readOnly}
							 handleDescription={this.handleDescription}/>

				<p>Goal:</p>
				{roadConditionActionTypes}

				<p>Instrument systeem:</p>
				{instrumentSystemTypes}

				<p>Instrumenten:</p>
				{actionSelector}

				<p>Constraint:</p>
				{constraintTypes}
				<Description description={this.state.constraintName}
							 notOptional={true}
							 disabled={this.props.readOnly}
							 handleDescription={this.handleConstraint}/>

				{!this.props.readOnly && (
					<Button className={"opslaan-button" + disabled + success} onClick={() => {
						if (!this.state.saved && !this.state.disabled) {
							if (!this.state.saved) {
								this.handleData();
								this.resetState();
							} else {
								alert("Item is al opgeslagen!")
							}
						}}}>
						{this.state.saved ? "Opgeslagen!" : "Item opslaan"}
					</Button>
				)}
			</div>
		);
	}
}

export default RoadConditionActionToolbox;
