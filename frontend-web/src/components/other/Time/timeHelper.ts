export type TimeObject = {
	allDay: boolean,
	repeat: string,

	startDate: string,
	startTime: string,

	endDate: string,
	endTime: string,

	endRepeatDate: string,

	customRepeatObject: Daily | Weekly | Monthly | Yearly,
	customRepeatFrequency: string
}

export type Daily = {
	everyNumberOfDays: number
}

export type Weekly = {
	selectedWeekdays: string[]
}

export type Monthly = {
	everyNumberOfMonths: number,
	selectedDays: number[],
}

export type Yearly = {
	selectedMonths: number[],
}

/**
 *
 * @param {TimeObject} object
 * @returns {string[]} With three cron tasks:
 * CronJob with start time of each occurrence,
 * CronJob with end time of each occurrence,
 */
function recurrentTimeObjectToCron(object: TimeObject) {
	let cronStartTime;
	let cronEndTime;

	if(object.startTime === '' && object.endTime === '') {
		cronStartTime = cronEndTime = "0 0";
	} else {
		cronStartTime = object.startTime.substr(3,2) + " " + object.startTime.substr(0,2);
		cronEndTime = object.endTime.substr(3,2) + " " + object.endTime.substr(0,2);
	}

	let dayOfMonthMonthsDayOfWeek = "";
	const date = new Date();

	// Custom Repeat Cron
	if(object.repeat === "Custom") {
		dayOfMonthMonthsDayOfWeek = customRepeatCron(object.customRepeatFrequency, object.customRepeatObject);
	} else {
		switch (object.repeat) {
			case "Every Day":
				dayOfMonthMonthsDayOfWeek = '* * *';
				break;
			case "Every Week":
				dayOfMonthMonthsDayOfWeek = '* * ' + date.getDay();
				break;
			case "Every Month":
				dayOfMonthMonthsDayOfWeek = date.getDate() + ' * *';
				break;
			case "Every Year":
				dayOfMonthMonthsDayOfWeek = date.getDate() + ' ' + date.getMonth() + ' *';
				break;
			default:
				dayOfMonthMonthsDayOfWeek = '* * *';
		}
	}

	cronStartTime += " " + dayOfMonthMonthsDayOfWeek;
	cronEndTime += " " + dayOfMonthMonthsDayOfWeek;

	return [cronStartTime, cronEndTime];
}

function customRepeatCron(type: string, object: Daily | Weekly | Monthly | Yearly) {
	let dayOfMonthMonthsDayOfWeek;

	switch (type) {
		case "Daily":
			dayOfMonthMonthsDayOfWeek = '1/' + (object as Daily).everyNumberOfDays + ' * *';
			break;
		case "Weekly":
			dayOfMonthMonthsDayOfWeek = '* * ' + ((object as Weekly).selectedWeekdays.length > 0 ? (object as Weekly).selectedWeekdays.join(',') : '*');
			break;
		case "Monthly":
			let days;
			if ((object as Monthly).selectedDays.length !== 0) {
				days = (object as Monthly).selectedDays.join(',') ;
			} else {
				days = '* ';
			}
			dayOfMonthMonthsDayOfWeek = days + ' 1/' + (object as Monthly).everyNumberOfMonths + ' *';
			break;
		case "Yearly":
			let months;
			if ((object as Yearly).selectedMonths.length === 0) {
				months = '0'
			} else {
				months = (object as Yearly).selectedMonths.join(',');
			}
			dayOfMonthMonthsDayOfWeek = '* ' + months + ' *';
			break;
		default:
			dayOfMonthMonthsDayOfWeek = '* * *';
	}
	return dayOfMonthMonthsDayOfWeek;
}

function cronParser(data: { startCron: string, endCron: string, startDate: string, endDate: string, endRepeatDate: string}) {
	let cronArray = data.startCron.split(' ');

	let timeObject: TimeObject = {
		allDay: cronArray[0] === '*',
		repeat: '',
		endRepeatDate: data.endRepeatDate,

		startDate: data.startDate,
		startTime: cronArray[1] + ':' + cronArray[0],

		endDate: data.endDate,
		endTime: data.endCron.split(' ')[1] + ':' + data.endCron.split(' ')[0],

		customRepeatObject: undefined,
		customRepeatFrequency: ''
	};

	if(data.startCron !== '' && data.endCron !== '' && data.endRepeatDate !== '') {
		if(cronArray[2] === '-' && cronArray[3] === '-' && cronArray[4] === '-') {
			timeObject = {
				...timeObject,
				repeat: "None"
			}
		} else if (cronArray[2] === '*' && cronArray[3] === '*' && cronArray[4] === '*') {
			// if * * * it is every day
			timeObject = {
				...timeObject,
				repeat: "Every Day"
			}
		} else if (cronArray[2] === '*' && cronArray[3] === '*' && !cronArray[4].includes(',') && cronArray[4] !== '*') {
			// if * * 0-6 it is every week
			timeObject = {
				...timeObject,
				repeat: "Every Week"
			}
		} else if (!cronArray[2].includes(',') && cronArray[2] !== '*' && cronArray[3] === '*' && cronArray[4] === '*') {
			// if 1-31 * * it is every month
			timeObject = {
				...timeObject,
				repeat: "Every Month"
			}
		} else if (!cronArray[2].includes(',') && cronArray[2] !== '*' && !cronArray[3].includes(',') && cronArray[3] !== '*' && cronArray[4] === '*') {
			// if 1-31 0-11 * it is every year
			timeObject = {
				...timeObject,
				repeat: "Every Year"
			}
		} else if (cronArray[2].includes('1/') && cronArray[3] === '*' && cronArray[4] === '*') {
			// if 1/... * * it is customDaily
			timeObject = {
				...timeObject,
				repeat: "Custom",
				customRepeatFrequency: "Daily",
				customRepeatObject: {
					everyNumberOfDays: parseInt(cronArray[2].substring(2))
				}
			}
		} else if (cronArray[2] === '*' && cronArray[3] === '*' && cronArray[4].includes(',')) {
			// if * * ..,.. it is customWeekly
			timeObject = {
				...timeObject,
				repeat: "Custom",
				customRepeatFrequency: "Weekly",
				customRepeatObject: {
					selectedWeekdays: cronArray[4].split(',')
				}

			}
		} else if (cronArray[3].includes('1/') && cronArray[4] === '*') {
			// if ..,.. 1/.. * OR * 1/... * it is customMonthly
			timeObject = {
				...timeObject,
				repeat: "Custom",
				customRepeatFrequency: "Monthly",
				customRepeatObject: {
					everyNumberOfMonths: parseInt(cronArray[3].substring(2)),
					selectedDays: cronArray[2] === '*' ? [] : cronArray[2].split(',').map(string => parseInt(string))
				}
			}
		} else if (cronArray[2] === '*' && cronArray[3].includes(',') && cronArray[4] === '*') {
			// if * ..,.. * it is customYearly
			timeObject = {
				...timeObject,
				repeat: "Custom",
				customRepeatFrequency: "Yearly",
				customRepeatObject: {
					selectedMonths: cronArray[3].split(',').map(string => parseInt(string))
				}
			}
		}
	} else {
		timeObject = {
			...timeObject,
			repeat: "None:"
		}
	}

	return timeObject;
}

export const timeHelper = {
	recurrentTimeObjectToCron: recurrentTimeObjectToCron,
	cronParser: cronParser
};