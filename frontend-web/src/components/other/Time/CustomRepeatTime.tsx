import * as React from 'react';
import CustomDaily from "./Custom/CustomDaily";
import CustomWeekly from "./Custom/CustomWeekly";
import CustomMonthly from "./Custom/CustomMonthly";
import CustomYearly from "./Custom/CustomYearly";
import {Daily, Monthly, Weekly, Yearly} from "./timeHelper";

type Props = {
	handleTime: (string, any) => void,
	handleCancel: () => void,
	customRepeatFrequency: string,
	customRepeatObject: Daily | Weekly | Monthly | Yearly
}

type State = {
	frequency: string
}

class CustomRepeatTime extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			frequency: this.props.customRepeatFrequency ? this.props.customRepeatFrequency : "Daily"
		}
	}

	frequencyMenu() {
		switch (this.state.frequency) {
			case "Daily":
				return <CustomDaily
					handleDaily={(daily) => this.props.handleTime("Daily", daily)}
					handleCancel={this.props.handleCancel}
					customRepeatObject={this.props.customRepeatObject as Daily}
				/>;
			case "Weekly":
				return <CustomWeekly
					handleWeekly={(weekly) => this.props.handleTime("Weekly", weekly)}
					handleCancel={this.props.handleCancel}
					customRepeatObject={this.props.customRepeatObject as Weekly}
				/>;
			case "Monthly":
				return <CustomMonthly
					handleMonthly={(monthly) => this.props.handleTime("Monthly", monthly)}
					handleCancel={this.props.handleCancel}
					customRepeatObject={this.props.customRepeatObject as Monthly}
				/>;
			case "Yearly":
				return <CustomYearly
					handleYearly={(yearly) => this.props.handleTime("Yearly", yearly)}
					handleCancel={this.props.handleCancel}
					customRepeatObject={this.props.customRepeatObject as Yearly}
				/>;
			default:
				return <div>No type of frequency selected.</div>;
		}
	}

	render() {
		return (
			<div>
				<div>
					<span>Frequency</span>
					<select value={this.state.frequency} onChange={(e) => this.setState({frequency: e.target.value})}>
						<option value="Daily">Daily</option>
						<option value="Weekly">Weekly</option>
						<option value="Monthly">Monthly</option>
						<option value="Yearly">Yearly</option>
					</select>
				</div>
				{this.frequencyMenu()}
			</div>
		);
	}
}

export default CustomRepeatTime;
