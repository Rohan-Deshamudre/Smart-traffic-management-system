import * as React from 'react';
import Name from "../../../../components/other/Name";
import Button from "react-bootstrap/Button";
import Time from "../../../../components/other/Time";
import CongestionLevelButton from "../../../../components/buttons/CongestionLevelButton";
import Type from "../../../../components/other/Type";
import '../../styles/toolbox.scss';
import {Query} from "react-apollo";
import {GET_ROAD_CONDITION_TYPES} from "./RoadConditionToolboxQueries";


type Props = {
	id: number,
	data?: any,
	readOnly?: boolean,
	handleData: (newData: any) => void
}

type State = {
	name: string,
	time: TimeType,
	level: number,
	roadConditionTypeId: number,
	roadCondition: RoadConditionToolbox[],
	saved: boolean,
	disabled: boolean
}

type TimeType = {
	startCron: string,
	endCron: string,
	startDate: string,
	endDate: string,
	endRepeatDate: string
}

/*
	UpdateRoadCondition component
	Used by [UpdateRoadCondition] in [Scenario-Designer]
	Shows corresponding input fields for a Condition type in the decision tree
	It passes: state to parent.
 */
class RoadConditionToolbox extends React.Component<Props, State> {
	baseState: State = {
		name: '',
		time: undefined,
		level: undefined,
		roadConditionTypeId: -1,
		roadCondition: [],
		saved: true,
		disabled: true
	};

	constructor(props: Props) {
		super(props);
		this.state = this.baseState;

		let data = this.props.data !== undefined ? this.props.data : {roadConditions: []};
		if (data.roadConditions.length > 0) {
			this.state = {
				...this.state,
				roadConditionTypeId: data.roadConditions[0].roadConditionType.id,
				name: data.roadConditions[0].name,
				time: data.roadConditions[0].roadConditionDate ? data.roadConditions[0].roadConditionDate : undefined,
				level: data.roadConditions[0].value
			}
		}


		this.handleName = this.handleName.bind(this);
		this.handleData = this.handleData.bind(this);
		this.handleTime = this.handleTime.bind(this);
		this.handleCongestionLevel = this.handleCongestionLevel.bind(this);
		this.handleType = this.handleType.bind(this);
		this.disabled = this.disabled.bind(this);
		this.resetState = this.resetState.bind(this);
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.id !== prevProps.id && this.props.data === undefined) {
			this.setState({
				...this.baseState
			})
		}
	}

	resetState() {
		if (this.props.data === undefined) {
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

	handleName(newName: string) {
		this.setState({
			saved: false,
			name: newName
		}, () => this.disabled());
	}

	handleTime(newTime: TimeType) {
		this.setState({
			saved: false,
			time: newTime
		}, () => this.disabled());
	}

	handleCongestionLevel(newLevel: number) {
		this.setState({
			saved: false,
			level: newLevel
		}, () => this.disabled());
	}

	handleType(id: number) {
		this.setState({
			saved: false,
			roadConditionTypeId: id,
		}, () => this.disabled());
	}

	handleData() {
		this.props.handleData(this.state);
	}


	disabled() {
		this.setState({
			disabled: (
				this.state.name === ''
				|| this.state.roadConditionTypeId < 0
				|| (this.state.level === undefined && this.state.roadConditionTypeId === 7)
				|| this.state.time === undefined
			)
		});
	}

	render() {
		const disabled = this.state.disabled ? ' disabled' : '';
		const success = this.state.saved ? ' btn-success' : '';

		const roadConditionTypes = (
			<Query query={GET_ROAD_CONDITION_TYPES}>
				{({data, loading, error}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error</p>;
					return (
						<Type selectedId={this.state.roadConditionTypeId} handleType={this.handleType}
							  types={data.roadConditionTypes} disabled={this.props.readOnly}/>
					);
				}}
			</Query>
		);

		return (
			<div className='toolbox'>
				<Name name={this.state.name} handleName={this.handleName} disabled={this.props.readOnly}/>
				<Time data={this.state.time} handleTime={this.handleTime}
					  disabled={this.props.readOnly}/>
				{this.state.roadConditionTypeId == 7 ? (
					<CongestionLevelButton level={this.state.level} handleCongestionLevel={this.handleCongestionLevel}
										   disabled={this.props.readOnly}/>) : null
				}
				{roadConditionTypes}
				{!this.props.readOnly && (
					<Button className={"opslaan-button" + disabled + success} onClick={() => {
						if (!this.state.saved && !this.state.disabled) {
							this.handleData();
							this.resetState()
						}
					}}>
						{this.state.saved ? "Opgeslagen!" : "Item opslaan"}
					</Button>)
				}
			</div>
		);
	}
}

export default RoadConditionToolbox;
