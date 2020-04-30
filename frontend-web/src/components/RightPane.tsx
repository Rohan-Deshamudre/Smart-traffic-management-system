import * as React from 'react';
import {Subtract} from 'utility-types';

import "./styles/pane.scss"
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

export interface InjectedPRightPane {

}

interface PRightPane {
	active: boolean
	toggle: () => void
	paneName: string
	icon: string
}

interface SRightPane {
	// Add state here
}

const asRightPane = <P extends InjectedPRightPane>(
	WrappedComponent: React.ComponentType<P>
) => {

	return class AsRightPane extends React.Component<Subtract<P, InjectedPRightPane> & PRightPane, // Subtract so the wrapped component cannot be initialized
		SRightPane> {

		render() {
			const {active} = this.props as PRightPane;
			return (
				<div>
					{!active ? (
						<div className="open-pane-button right" onClick={this.props.toggle}>
							<img src={this.props.icon} alt={""} />
							<div className="description">{this.props.paneName}</div>
						</div>
					) : null
					}
					<div
						className={(active ? "active-right-pane " : "inactive-right-pane ") + "rightpane-container pane-container"}>
						<div className="close-pane-button right" onClick={this.props.toggle}>
							<img src={closeIcon} alt="x" />
						</div>
						<WrappedComponent {...this.props as P} />
					</div>
				</div>
			)
		}
	}
};


export default asRightPane;
