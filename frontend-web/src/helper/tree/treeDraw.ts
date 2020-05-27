import {select} from "d3";
import * as axios from 'axios';

/*
	When hovering over a condition node.
	Show its time stamp and level
 */
function drawConditionHover(g: any, d: any, i: number) {
	if (d.data.__typename === 'RoadConditionObjectType') {
		let name = select(g).append('g').attr('class', 'road-condition-hover').attr('id', 'road-condition-hover-' + i);

		const firstColumnXY = 5;
		const secondColumnX = 55;
		const secondRowY = 25;
		const thirdRowY = 45;

		name.append('rect').attr('class', 'road-condition-hover-rect');

		if (d.data.roadConditionDate) {
			name.append('rect').attr('class', 'road-condition-hover-time-box').attr('transform', 'translate(' + (secondColumnX - 3) + ',' + (firstColumnXY - 3) + ')').attr('rx', 3);
			name.append('text').attr('class', 'road-condition-hover-text').text('Van:').attr('transform', 'translate(' + firstColumnXY + ',' + firstColumnXY + ')');
			name.append('text').attr('class', 'road-condition-hover-time').text(d.data.roadConditionDate.startDate).attr('transform', 'translate(' + secondColumnX + ',' + firstColumnXY + ')');

			name.append('rect').attr('class', 'road-condition-hover-time-box').attr('transform', 'translate(' + (secondColumnX - 3) + ',' + (secondRowY - 3) + ')').attr('rx', 3);
			name.append('text').attr('class', 'road-condition-hover-text').text('Tot:').attr('transform', 'translate(' + firstColumnXY + ',' + secondRowY + ')');
			name.append('text').attr('class', 'road-condition-hover-time').text(d.data.roadConditionDate.endDate).attr('transform', 'translate(' + secondColumnX + ',' + secondRowY + ')');
		}

		if (d.data.roadConditionType.id === 7) {
			name.append('rect').attr('class', 'road-condition-hover-time-box level-box').attr('transform', 'translate(' + (secondColumnX - 3) + ',' + (thirdRowY - 3) + ')').attr('rx', 3);
			name.append('text').attr('class', 'road-condition-hover-text').text('Level:').attr('transform', 'translate(' + firstColumnXY + ',' + thirdRowY + ')');
			name.append('text').attr('class', 'road-condition-hover-value').text(d.data.value).attr('transform', 'translate(' + secondColumnX + ',' + thirdRowY + ')');
		}
	}
}

/*
	Get the right svg files for each of the nodes
 */
function drawIcon(node: any) {
	node.append('image')
		.attr('xlink:href', function (d: any) {

			switch (d.data.__typename) {
				case 'ScenarioObjectType':
					return '../../assets/tree_icons/scenario.svg';
				case 'RoadSegmentObjectType':
					return d.data.roadSegmentType.img ? '../../assets/tree_icons/road_segment/' + d.data.roadSegmentType.img + '.svg' : '';
				case 'RoadConditionObjectType':
					return d.data.roadConditionType.img ? '../../assets/tree_icons/road_condition/' + d.data.roadConditionType.img + '.svg' : '';
				case 'RoadConditionActionObjectType':
					break;
				case 'ResponsePlanObjectType':
					return '../../assets/tree_icons/response-plan.svg';
				case 'GateObjectType':
					// TODO check AND or OR.
					return '../../assets/tree_icons/gate-or.svg';
				default:
					return '../../assets/tree_icons/constraint.svg';
			}
		});
}

/*
	Draw the title bar and body rectangle for each of the nodes
 */
function drawNodes(nodeContent: any) {
	nodeContent.append('rect').attr('class', 'rect');

	let name = nodeContent.append('g');
	name.append('rect').attr('class', 'rect name-rect');
	name.append('text').attr('class', 'name-text').text((d: any) => {
		if (d.data.name) {
			return d.data.name.substr(0, 13)
		}
		else if (d.data.actionName) {
			return d.data.actionName.substr(0, 13)
		}
		else return '';
	});

}

/*
	Draw the road condition action as three four separate nodes
 */
function drawRoadConditionActions(nodeContent: any) {
	nodeContent.append("line").attr('stroke', 'black')
		.attr("x1", 0)
		.attr("y1", 30)
		.attr("x2", 750)
		.attr("y2", 30);

	drawRoadConditionActionGoal(nodeContent);
	drawInstrumentSystem(nodeContent);
	drawInstrumentActions(nodeContent);
	drawConstraint(nodeContent);
}

function drawRoadConditionActionGoal(nodeContent: any) {
	let roadConditionActionGoal = nodeContent.append('g').attr('class', 'roadConditionActionGoal');

	// Body Rectangle
	roadConditionActionGoal.append('rect').attr('class', 'rect');

	// Title bar of RoadConditionActionGoal
	let name = roadConditionActionGoal.append('g');
	name.append('rect').attr('class', 'rect name-rect');
	name.append('text').attr('class', 'name-text').text((d) => d.data.roadConditionActionGoal.name);

	// Image of RoadConditionActionGoal
	roadConditionActionGoal.append('image')
		.attr('xlink:href', (d => d.data.roadConditionActionGoal.img ? '../../assets/tree_icons/road_condition_action_goals/' + d.data.roadConditionActionGoal.img + '.svg' : ''));

}

function drawInstrumentSystem(nodeContent: any) {
	let instrumentSystem = nodeContent.append('g').attr('class', 'instrument-system').attr('transform', 'translate(250, 0)');
	// Body Rectangle
	instrumentSystem.append('rect').attr('class', 'rect');
	// Title bar of InstrumentSystem
	let name = instrumentSystem.append('g');
	name.append('rect').attr('class', 'rect name-rect');
	name.append('text').attr('class', 'name-text').text((d) => d.data.instrumentSystem.name);

	// Image of InstrumentSystem
	instrumentSystem.append('image')
		.attr('xlink:href', '../../assets/tree_icons/instrumentsystem.svg');

	// InstrumentSystem hover
	instrumentSystem.on('mouseenter', ((d: any, i) => {
		if (d.data.description && d.data.description.length > 0) {
			let description = select(instrumentSystem._groups[0][i]).append('g').attr('id', 'instrumentSystemHover').attr('transform', 'translate(-130,0)');
			description.append('rect').attr('class', 'description-box');
			description.append('text').attr('class', 'description-text').text(d.data.description.substr(0, 14)).attr('transform', 'translate(5, 5)');
			description.append('text').attr('class', 'description-text').text(d.data.description.substr(14, 14)).attr('transform', 'translate(5, 25)');
			description.append('text').attr('class', 'description-text').text(d.data.description.substr(28, 14)).attr('transform', 'translate(5, 45)');
		}
	}));

	instrumentSystem.on('mouseleave', () => instrumentSystem.selectAll('#instrumentSystemHover').remove());
}

function drawInstrumentActions(nodeContent: any) {
	let instrumentActions = nodeContent.append('g').attr('class', 'instrument-actions').attr('transform', 'translate(500, 0)');

	// Body Rectangle
	instrumentActions.append('rect').attr('class', 'rect instrument-actions-rect');

	// Title bar of InstrumentActions
	let name = instrumentActions.append('g');
	name.append('rect').attr('class', 'rect name-rect instrument-actions-name-rect');
	name.append('text').attr('class', 'name-text').text('Instrument Actions');

	drawInstrumentActionList(instrumentActions);

}

function drawInstrumentActionList(instrumentActions: any) {
	// List of Instruments and InstrumentActions
	for (let index = 0; index < instrumentActions.data().length; index++) {
		let selectedInstrument = select(instrumentActions._groups[0][index]);
		let listWrapper = selectedInstrument.append('g').attr('class', 'list-wrapper');
		let carouselNumber = 0;
		const allData = instrumentActions.data()[index].data.instrumentActions ? instrumentActions.data()[index].data.instrumentActions : [];
		let data = allData;

		let listData = data.slice(carouselNumber, carouselNumber + 3);
		let list = listWrapper.selectAll('g').data(listData).enter().append('g').attr('transform', (d, i) => 'translate(0,' + (i * 22) + ')');
		drawInstrumentActionListItems(list);

		// Carousel buttons
		let buttonUp = selectedInstrument.append('g').attr('class', 'button-up');
		buttonUp.append('rect').attr('class', 'button-background');
		buttonUp.append('text').text('⇧').attr('transform', 'translate(1,1)');
		buttonUp.on('click', () => {
			if (carouselNumber > 0) {
				carouselNumber -= 1;
				list.remove();
				list = listWrapper.selectAll('g').data(data.slice(carouselNumber, carouselNumber + 3)).enter().append('g').attr('transform', (d, i) => 'translate(0,' + (i * 22) + ')');
				drawInstrumentActionListItems(list);
			}

		});

		let buttonDown = selectedInstrument.append('g').attr('class', 'button-down');
		buttonDown.append('rect').attr('class', 'button-background');
		buttonDown.append('text').text('⇩').attr('transform', 'translate(1,2)');
		buttonDown.on('click', () => {
			if ((carouselNumber + 3) < data.length) {
				carouselNumber += 1;
				list.remove();
				list = listWrapper.selectAll('g').data(data.slice(carouselNumber, carouselNumber + 3)).enter().append('g').attr('transform', (d, i) => 'translate(0,' + (i * 22) + ')');
				drawInstrumentActionListItems(list);
			}

		});

		// InstrumentActions hover
		selectedInstrument.on('mouseenter', (() => {
			let description = selectedInstrument.append('g').attr('id', 'instrumentSystemHover').attr('transform', 'translate(-100,0)');
			description.append('rect').attr('class', 'description-box');

			let index = 0;
			['DRIP', 'VRI', 'TDI', 'MTM', 'Tekstkar', 'Verkeersregelaar', 'Overig'].forEach((instrumentName) => {
				if(getInstrumentAmounts(allData, instrumentName) > 0) {
					let descriptionInstrumentName = description.append('g').attr('id', 'descrIntrsName' + instrumentName).attr('class', 'description-instrument-name');
					descriptionInstrumentName.on('click', () => {
						list.remove();
						carouselNumber = 0;
						data = allData.filter((instrumentAction) => instrumentAction.instrument.instrumentType.name === instrumentName);
						list = listWrapper.selectAll('g').data(data.slice(0, 3)).enter().append('g').attr('transform', (d, i) => 'translate(0,' + (i * 22) + ')');
						drawInstrumentActionListItems(list);
					});
					descriptionInstrumentName.append('text').attr('class', 'description-text').text(instrumentName + ': ').attr('transform', 'translate(5,' + (5 + index * 8) + ')');
					descriptionInstrumentName.append('text').attr('class', 'description-text').text(getInstrumentAmounts(allData, instrumentName)).attr('transform', 'translate(90,' + (5 + index * 8) + ')');
					index += 1;
				}
			});
		}));

		selectedInstrument.on('mouseleave', () => selectedInstrument.selectAll('#instrumentSystemHover').remove());

	}


}

function getInstrumentAmounts(instrumentActions: any, instrumentName: string) {
	return instrumentActions.filter((action) => {
		return action.instrument.instrumentType.name === instrumentName
	}).length;
}

function drawInstrumentActionListItems(list: any) {
	list.append("rect")
		.attr('stroke', 'black')
		.attr('class', 'instrument-action-background');

	list.append('rect')
		.attr('transform', 'translate(1,1)')
		.attr('class', 'instrument-background');

	list.append('text')
		.attr('class', 'instrument-title')
		.attr('transform', 'translate(3, 2)')
		.text((d) => d.instrument.name);

	list.append('text')
		.attr('class', 'action-text')
		.attr('transform', 'translate(5,13)')
		.text((d) => d.text.substr(0, 35));
}

function drawConstraint(nodeContent: any) {
	let constraint = nodeContent.append('g').attr('class', 'constraint').attr('transform', 'translate(750, 0)');

	// Body Rectangle
	constraint.append('rect').attr('class', 'rect');

	// Image of Constraint
	constraint.append('image')
		.attr('xlink:href', '../../assets/tree_icons/constraint.svg');

	// Constraint hover
	constraint.on('mouseenter', ((d: any, i) => {
		if (d.data.constraint !== undefined) {
			// Title bar of Constraint
			let name = select(constraint._groups[0][i]).append('g').attr('class', 'constraint-title-bar').attr('id', 'constraintTitleBar');
			name.append('rect').attr('class', (d: any) => {
				switch (d.data.constraint.constraintType.name) {
					case "Physical":
						return 'rect name-rect name-rect-green';
					case "Technical":
						return 'rect name-rect name-rect-blue';
					case "Traffic related":
						return 'rect name-rect name-rect-yellow';
					default:
						return 'rect name-rect name-rect';
				}
			});
			name.append('text').attr('class',  'name-text').text((d: any) => d.data.constraint.name.substr(0, 13));

		}
	}));

	constraint.on('mouseleave', () => constraint.selectAll('#constraintTitleBar').remove());

}

/*
	When the user hovers on a node, display the three buttons: to delete, add or hide a node.
 */
function drawButtons(g: any, d: any, i: number, that: any) {

	let buttons = select(g).filter((d: any) => d.data.__typename !== 'RoadConditionActionObjectType').append('g').attr('id', 'buttons-' + i);

	// -- Add button
	let addButton = buttons.append('g')
		.on('click', function (d: any, i) {
			that.addButtonFunctionality(this, that, d);
		})
		.attr('class', 'button add-button');

	addButton.append('rect').attr('class', 'button-rect');
	addButton.append('text').text('+').attr('class', 'button-text');

	// -- Hide Button
	let hideButton = buttons.append('g')
		.attr('maximize', 'false')
		.on('click', function (d: any, i) {
			that.toggleVisibilityButtonFunctionality(that, d);
		})
		.attr('class', 'button hide-button');

	hideButton.append('rect').attr('class', 'button-rect');
	hideButton.append('text').attr('class', 'button-text')
		.text(function (d: any, i) {
			if (d.data.hasOwnProperty('children') && d.data.children.length == 0) {
				return '+';
			} else {
				return '-'
			}
		});

	// -- Response plan button
	let responsePlanButtonRoadSegment = buttons.filter((d: any) => {
		return d.data.__typename === 'RoadSegmentObjectType';
	}).append('g')
		.on('click', function (d: any, i) {
			that.openModalWithScenario(d.data.id);
		})
		.attr('class', 'button response-plan-button');

	// TODO replace with d.data.id.
	hasResponsePlan(2).then(
		(result) => {
			if (result) {
				responsePlanButtonRoadSegment.append('rect').attr('class', 'button-rect');
				responsePlanButtonRoadSegment.append('text').attr('class', 'button-text')
					.text(function (d: any, i) {
						if (d.data.hasOwnProperty('children') && d.data.children.length == 0) {
							return 'RP+';
						} else {
							return 'RP-'
						}
					});
			}
		}
	);

	let responsePlanButtonScenario = buttons.filter((d: any) => d.data.__typename === 'ScenarioObjectType').append('g')
		.on('click', function (d: any, i) {
			that.openModalWithRoadSegment(d.data.id);
		})
		.attr('class', 'button response-plan-button');

	// TODO replace with d.data.id.
	hasResponsePlan(1).then(
		(result) => {
			if (result) {
				responsePlanButtonScenario.append('rect').attr('class', 'button-rect');
				responsePlanButtonScenario.append('text').attr('class', 'button-text')
					.text(function (d: any, i) {
						if (d.data.hasOwnProperty('children') && d.data.children.length == 0) {
							return 'RP+';
						} else {
							return 'RP-'
						}
					})
			}
		}
	);
}

function hasResponsePlan(id: number): Promise<boolean> {
	// TODO change id to scenario_id and road_segment_id and make dynamic function.
	return axios.default.post(process.env.RESPONSE_PLAN_EXPORT, { id: id })
		.then((res) => {
			console.log(res);
			return res.data.children && res.data.children.length > 0;
		})
		.catch(() => {
			return false;
		});
}


export const treeDraw = {
	drawConditionHover: drawConditionHover,
	drawIcon: drawIcon,
	drawNodes: drawNodes,
	drawRoadConditionActions: drawRoadConditionActions,
	drawButtons: drawButtons
};
