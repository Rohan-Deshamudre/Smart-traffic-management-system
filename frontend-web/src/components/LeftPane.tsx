import * as React from 'react';
import {Subtract} from 'utility-types';

import "./styles/pane.scss"
// @ts-ignore
import scenarioIcon from "../assets/node_icons/scenario.svg";
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

export interface InjectedPLeftPane {
}

interface PLeftPane {
	active: boolean;
	toggle: () => void;
	paneName: string
	icon: string
}

interface SLeftPane {
	// Add state here
}

const asLeftPane = <P extends InjectedPLeftPane>(
	WrappedComponent: React.ComponentType<P>
) => {

	return class AsLeftPane extends React.Component<
		Subtract<P, InjectedPLeftPane> & PLeftPane, // Substract so the wrappedcomponent cannot be initialized
		SLeftPane
		> {

		constructor(props) {
			super(props);


		}

		render() {
			const { active } = this.props as PLeftPane;

			return (
				<div>
					{ !active ? (
							<div className="open-pane-button left" onClick={this.props.toggle}>
								<div className="description">{this.props.paneName}</div>
								<img src={this.props.icon} alt={""} />
							</div>
						) : null }
					<div className={(active ? "active-left-pane " : "inactive-left-pane ") + "leftpane-container pane-container"}>
						<div className="close-pane-button left" onClick={this.props.toggle}>
							<img src={closeIcon} alt="x" />
						</div>
						<WrappedComponent {...this.props as P} />
					</div>
				</div>
			);

		}
	}
};


export default asLeftPane;

