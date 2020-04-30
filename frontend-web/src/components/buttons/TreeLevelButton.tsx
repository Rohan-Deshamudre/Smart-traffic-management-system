import * as React from 'react';
import Button from "react-bootstrap/Button";
import gql from "graphql-tag";

import '../styles/navbar.scss'

type Props = {
	height: number,
	handleLevel: (level: number) => void
	level?: number
}


class TreeLevelButton extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
		this.handleTreeLevel = this.handleTreeLevel.bind(this);
	}

	handleTreeLevel(newLevel: number) {
		this.props.handleLevel(newLevel);
		this.setState({level: newLevel})
	}

	render() {
		if (this.props.height > 1) {
			const values = Array.from(Array(this.props.height + 1), (e, i) => i);
			let currLevel = this.props.level;
			if (currLevel < 0) {
				currLevel = this.props.height;
			}
			const buttons = values.map((btnNum) =>
				<div key={btnNum} className={(btnNum <= currLevel ? 'active ' : '') + 'level-option'}
					onClick={() => this.handleTreeLevel(btnNum)}>{btnNum}</div>
			);

			return (
				<div className="nav-wrap level-selector-wrap d-flex justify-content-center w-100">
					<div className="selector-info">
						Lvl.
					</div>
					{buttons}
				</div>
			);
		} else {
			return null
		}
	}
}

export default TreeLevelButton;
