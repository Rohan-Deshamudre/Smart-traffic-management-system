import * as React from 'react';
import WeekDaySelector from "../WeekDaySelector";
import {Weekly} from "../timeHelper";

type Props = {
	handleWeekly: (any: any) => void,
	handleCancel: () => void
	customRepeatObject: Weekly
}

type State = {
	selectedWeekdays: string[]
}

class CustomWeekly extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedWeekdays: this.props.customRepeatObject ? this.props.customRepeatObject.selectedWeekdays : []
		};
	}

	render() {

		return (
			<div className="custom-box">
				<div>
					<WeekDaySelector handleWeekday={(weekDays) => this.setState({selectedWeekdays: weekDays}, () => this.props.handleWeekly(this.state))}/>
				</div>
			</div>
		);
	}
}

export default CustomWeekly;
