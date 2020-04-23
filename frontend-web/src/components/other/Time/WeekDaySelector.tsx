import * as React from 'react';

type Props = {
	handleWeekday: (selectedWeekdays: string[]) => void
}

type State = {
	selectedWeekdays: string[]
}

class WeekDaySelector extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedWeekdays: []
		};
		this.setWeekday = this.setWeekday.bind(this);
	}

	setWeekday(newWeekday: string) {
		if (this.state.selectedWeekdays.includes(newWeekday)) {
			this.setState({
				selectedWeekdays: this.state.selectedWeekdays.filter(weekday => weekday !== newWeekday)
			}, () => this.props.handleWeekday(this.state.selectedWeekdays))
		} else {
			this.setState({
				selectedWeekdays: [...this.state.selectedWeekdays, newWeekday]
			}, () => this.props.handleWeekday(this.state.selectedWeekdays));
		}
	}

	render() {
		const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((week) => <button className={this.state.selectedWeekdays.includes(week) ? 'active' : ''} key={week} onClick={() => this.setWeekday(week)}>{week.substr(0,1)}</button>);

		return (
			<div>
				{weekdays}
			</div>
		);
	}
}

export default WeekDaySelector;
