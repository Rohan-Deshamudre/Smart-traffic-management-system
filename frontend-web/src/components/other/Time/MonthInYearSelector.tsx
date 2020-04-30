import * as React from 'react';

type Props = {
	handleSelectedMonth: (any) => void,
	selectedMonths?: number[]
}

type State = {
	selectedMonths: number[];
}

class MonthInYearSelector extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedMonths: this.props.selectedMonths ? this.props.selectedMonths : []
		};
		this.renderTable = this.renderTable.bind(this);
		this.selectMonth = this.selectMonth.bind(this);
	}

	selectMonth(month: number) {
		if (this.state.selectedMonths.includes(month)) {
			this.setState({
				selectedMonths: this.state.selectedMonths.filter(currMonth => currMonth !== month)
			}, () => this.props.handleSelectedMonth(this.state.selectedMonths))
		} else {
			this.setState({
				selectedMonths: [...this.state.selectedMonths, month]
			}, () => this.props.handleSelectedMonth(this.state.selectedMonths));
		}
	}

	renderTable() {
		const table = [
			['Jan', 'Feb', 'Mar', 'Apr'],
			['May', 'Jun', 'Jul', 'Aug'],
			['Sep', 'Okt', 'Nov', 'Dec']
		].map((quarter, quarterIndex) => {
			const quarterToTableRow = quarter.map((monthName, index) => {
				const monthIndex = quarterIndex * 4 + index;
				return <td
				key={monthName}
				onClick={() => this.selectMonth(monthIndex)}
				className={this.state.selectedMonths.includes(monthIndex) ? "table-cell active" : "table-cell"}
			>{monthName}</td>});
			return <tr key={quarter.toString()}>{quarterToTableRow}</tr>;
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

export default MonthInYearSelector;
