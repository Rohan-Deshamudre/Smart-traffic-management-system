import * as React from 'react';
import DayInMonthSelector from "../DayInMonthSelector";
import {Monthly} from "../timeHelper";

type Props = {
	handleMonthly: (any: any) => void,
	handleCancel: () => void,
	customRepeatObject: Monthly
}

type State = {
	everyNumberOfMonths: number,
	selectedDays: number[],
}

class CustomMonthly extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			everyNumberOfMonths: this.props.customRepeatObject ? this.props.customRepeatObject.everyNumberOfMonths : 1,
			selectedDays: this.props.customRepeatObject ? this.props.customRepeatObject.selectedDays : []
		};
		this.setAmount = this.setAmount.bind(this);
	}

	setAmount(newAmount: number) {
		let amount = newAmount;
		if(newAmount < 0 || isNaN(newAmount)) {
			amount = 0;
		}
		this.setState({
			everyNumberOfMonths: amount
		}, () => this.props.handleMonthly(this.state))
	}

	render() {

		return (
			<div className="custom-box">
				<div>
					<span>Every</span>
					<input type="number" value={this.state.everyNumberOfMonths}
						   onChange={(e) => this.setAmount(parseInt(e.target.value))}/>
					<span>month(s).</span>
				</div>
				<div>
					<span>Each</span>
					<DayInMonthSelector selectedDays={this.props.customRepeatObject ? this.props.customRepeatObject.selectedDays : undefined}
										handleSelectedDay={(selectedDays) => this.setState({selectedDays: selectedDays}, () => this.props.handleMonthly(this.state))}
					/>
				</div>
			</div>
		);
	}
}

export default CustomMonthly;
