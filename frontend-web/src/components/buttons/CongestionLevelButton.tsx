import * as React from 'react';
import Button from "react-bootstrap/Button";
import "./styles/congestionLevelButton.scss"

type Props = {
	level?: number,
	disabled?: boolean,
	handleCongestionLevel: ((a: number) => void)
}

type State = {}

class CongestionLevelButton extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.handleCongestionLevel = this.handleCongestionLevel.bind(this);
	}

	handleCongestionLevel(newLevel: number) {
		this.props.handleCongestionLevel(newLevel);
	}

	render() {
		const buttons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((btnNum) =>
			<Button key={'button' + btnNum} disabled={this.props.disabled ?  !(this.props.level === btnNum) : false} onClick={() => this.handleCongestionLevel(btnNum)} className={this.props.level === btnNum ? 'active' : ''}>{btnNum}</Button>
		);

		return (

			<div className="d-flex justify-content-center w-100">
				<div className="congestion-level-button">
					{buttons}
				</div>
			</div>
		);
	}
}

export default CongestionLevelButton;
