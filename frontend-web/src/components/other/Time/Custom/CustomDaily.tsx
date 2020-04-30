import * as React from 'react';
import {Daily} from "../timeHelper";

type Props = {
	handleDaily: (any: any) => void,
	handleCancel: () => void,
	customRepeatObject: Daily
}

type State = {
	everyNumberOfDays: number
}

class CustomDaily extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			everyNumberOfDays: this.props.customRepeatObject ? this.props.customRepeatObject.everyNumberOfDays : 1
		};
		this.setAmount = this.setAmount.bind(this);
	}

	setAmount(newAmount: number) {
		let amount = newAmount;
		if(newAmount < 0 || isNaN(newAmount)) {
			amount = 0;
		}
		this.setState({
			everyNumberOfDays: amount
		}, () => this.props.handleDaily(this.state))
	}

	render() {
		return (
			<div className="custom-box">
				<span>Every</span>
				<input type="number" value={this.state.everyNumberOfDays}
					   onChange={(e) => this.setAmount(parseInt(e.target.value))}/>
				<span>day(s).</span>
			</div>
		);
	}
}

export default CustomDaily;
