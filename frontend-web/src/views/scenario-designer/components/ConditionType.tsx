import * as React from 'react';
import '../styles/conditionType.scss';

// @ts-ignore
import brokenCarIcon from "./../../../assets/broken-car.svg";

type CTProps = {
	text: string,
	onClick: (newConditionType: object) => void,
	conditionType: object
}

class ConditionType extends React.Component<CTProps, {}> {
	constructor(props: CTProps) {
		super(props);
		this.handleConditionType = this.handleConditionType.bind(this);
	}

	handleConditionType(newConditionType: object) {
		this.props.onClick(newConditionType);
	}

	render() {
		return (
			<div  onClick={() => this.handleConditionType(this.props.conditionType)} className="condition-type d-flex align-items-center text-center">
				<img src={brokenCarIcon} alt="Broken Car"/>
				<span>{this.props.text}</span>
			</div>
		);
	}
}

export default ConditionType;