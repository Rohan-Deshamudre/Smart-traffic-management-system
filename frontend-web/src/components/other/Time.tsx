import * as React from 'react';
import CustomRepeatTime from "./Time/CustomRepeatTime";
import {timeHelper, TimeObject} from "./Time/timeHelper";
import '../styles/time-input.scss';
import Button from "react-bootstrap/Button";

type Props = {
	handleTime: (any) => void,
	disabled?: boolean,
	data?: {
		startCron: string,
		endCron: string,
		startDate: string,
		endDate: string,
		endRepeatDate: string
	}
}

class Time extends React.Component<Props, TimeObject> {
	constructor(props: Props) {
		super(props);
		this.state = {
			allDay: false,
			repeat: "None",
			startDate: '',
			startTime: '',
			endDate: '',
			endTime: '',
			endRepeatDate: '',
			customRepeatObject: undefined,
			customRepeatFrequency: undefined
		};

		this.toggleAllDay = this.toggleAllDay.bind(this);
		this.saveTime = this.saveTime.bind(this);
	}

	componentDidMount() {
		if(this.props.data !== undefined) {
			this.setState(timeHelper.cronParser(this.props.data));
		}
	}

	toggleAllDay() {
		if(this.state.allDay) {
			this.setState({
				allDay: !this.state.allDay
			})
		} else {
			this.setState({
				allDay: !this.state.allDay,
				startTime: '',
				endTime: ''
			})
		}
	}

	saveTime() {
		let newStartCron = '';
		let newEndCron = '';
		if (this.state.repeat !== "None") {
			[newStartCron, newEndCron] = timeHelper.recurrentTimeObjectToCron(this.state);
		} else {
			newStartCron = this.state.startTime.substr(3,2) + " " + this.state.startTime.substr(0,2) + ' - - -';
			newEndCron = this.state.endTime.substr(3,2) + " " + this.state.endTime.substr(0,2) + ' - - -';
		}
		this.props.handleTime({
			startCron: newStartCron,
			endCron: newEndCron,
			startDate: this.state.startDate,
			endDate: this.state.endDate,
			endRepeatDate: this.state.endRepeatDate
		})

	}

	render() {
		return (
			<div className="time-input">
				<div>
					<input type="checkbox" checked={this.state.allDay} disabled={this.props.disabled} onChange={() => this.toggleAllDay()}/>
					<span>All-day</span>
				</div>
				<div>
					<span>Starts:</span>
					<input type="date" className="date-picker" value={this.state.startDate} disabled={this.props.disabled}
						   onChange={(e) => this.setState({startDate: e.target.value})}/>
					{!this.state.allDay && <input type="time" className="time-picker" value={this.state.startTime} disabled={this.props.disabled}
												  onChange={(e) => this.setState({startTime: e.target.value})}/>}
				</div>
				<div>
					<span>Ends:</span>
					<input type="date" className="date-picker" value={this.state.endDate} disabled={this.props.disabled}
						   onChange={(e) => this.setState({endDate: e.target.value})}/>
					{!this.state.allDay && <input type="time" className="time-picker" value={this.state.endTime} disabled={this.props.disabled}
												  onChange={(e) => this.setState({endTime: e.target.value})}/>}
				</div>
				<div>
					<span>Repeat</span>
					<select value={this.state.repeat} disabled={this.props.disabled} onChange={(e) => this.setState({
						repeat: e.target.value,
						endRepeatDate: this.state.repeat === "None" ? '' : this.state.endRepeatDate
					})}>
						<option value="None">None</option>
						<option value="Every Day">Every Day</option>
						<option value="Every Week">Every Week</option>
						<option value="Every Month">Every Month</option>
						<option value="Every Year">Every Year</option>
						<option value="Custom">Custom</option>
					</select>
				</div>
				{this.state.repeat === "Custom" && <CustomRepeatTime
					handleTime={(frequency, object) => this.setState({
					customRepeatFrequency: frequency,
					customRepeatObject: object})}
					handleCancel={() => this.setState({repeat: "None"})}
					customRepeatFrequency={this.state.customRepeatFrequency}
					customRepeatObject={this.state.customRepeatObject}
				/>}
				{this.state.repeat !== "None" &&
				<div>
					<span>End-Repeat on date</span>
					<input type="date" className="date-picker" value={this.state.endRepeatDate}
						   onChange={(e) => this.setState({endRepeatDate: e.target.value})} disabled={this.props.disabled}/>
				</div>
				}
				{ !this.props.disabled && (
					<div>
                    	<Button onClick={() => this.saveTime()}>Save</Button>
					</div>
				)}

			</div>
		);
	}
}

export default Time;
