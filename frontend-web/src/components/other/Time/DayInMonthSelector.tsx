import * as React from 'react';

type Props = {
	handleSelectedDay: (any) => void,
	selectedDays?: number[]
}

type State = {
	selectedDays: number[];
}

class DayInMonthSelector extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedDays: this.props.selectedDays ? this.props.selectedDays : []
		};
		this.renderTable = this.renderTable.bind(this);
		this.selectDay = this.selectDay.bind(this);
	}

	selectDay(dayNumber: number) {
		if (this.state.selectedDays.includes(dayNumber)) {
			this.setState({
				selectedDays: this.state.selectedDays.filter(number => number !== dayNumber)
			}, () => this.props.handleSelectedDay(this.state.selectedDays))
		} else {
			this.setState({
				selectedDays: [...this.state.selectedDays, dayNumber]
			}, () => this.props.handleSelectedDay(this.state.selectedDays));
		}
	}

	renderTable() {
		const table = [
			[1, 2, 3, 4, 5, 6, 7],
			[8, 9, 10, 11, 12, 13, 14],
			[15, 16, 17, 18, 19, 20, 21],
			[22, 23, 24, 25, 26, 27, 28],
			[29, 30, 31]
		].map(week => {
			const days = week.map(dayNumber => <td
				key={dayNumber}
				onClick={() => this.selectDay(dayNumber)}
			className={this.state.selectedDays.includes(dayNumber) ? "table-cell active" : "table-cell"}>{dayNumber}</td>);
			return <tr key={week.toString()}>{days}</tr>;
		});

		return <table>
			<tbody>{table}</tbody>
		</table>;
	}

	render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		);
	}
}

export default DayInMonthSelector;
