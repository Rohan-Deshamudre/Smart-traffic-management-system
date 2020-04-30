import * as React from 'react';
import MonthInYearSelector from "../MonthInYearSelector";
import {Yearly} from "../timeHelper";

type Props = {
	handleYearly: (any: any) => void,
	handleCancel: () => void,
	customRepeatObject: Yearly
}

type State = {
	selectedMonths: number[]
}

class CustomYearly extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedMonths: this.props.customRepeatObject ? this.props.customRepeatObject.selectedMonths : [],
		};
	}

	render() {

		return (
			<div className="custom-box">
				<span>Every year in:</span>
				<MonthInYearSelector
					handleSelectedMonth={(selectedMonths) => this.setState({selectedMonths: selectedMonths}, () => this.props.handleYearly(this.state))}/>
			</div>
		);
	}
}

export default CustomYearly;
