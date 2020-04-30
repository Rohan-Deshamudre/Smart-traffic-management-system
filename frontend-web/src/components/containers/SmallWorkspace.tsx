import * as React from 'react';
import { Subtract } from 'utility-types';

import './../styles/workspace.scss'
// @ts-ignore
import swapIcon from './../../assets/swap.svg';
// @ts-ignore
import plusIcon from './../../assets/plus.svg';

export interface InjectedPSmallWorkspace {
	// Add props here
}

type PSmallWorkspace = {
	rightPaneActive: boolean,
	minimized: boolean,
	minimize: () => void,
	swap: () => void,
}
type SSmallWorkspace = {
}

const asSmallWorkspace = <P extends InjectedPSmallWorkspace>(
	WrappedComponent: React.ComponentType<P>
) => {

	return class AsSmallWorkspace extends React.Component<
		Subtract<P, InjectedPSmallWorkspace> & PSmallWorkspace, // Substract so the wrappedcomponent cannot be initialized
		SSmallWorkspace
		> {

		constructor(props: Subtract<P, InjectedPSmallWorkspace> & PSmallWorkspace) {
			super(props);

			this.state = {
				minimized: true
			};
		}

		render() {
			let containerName = "small-workspace-container";
			containerName += this.props.minimized ? " small-workspace-container-closed" : " small-workspace-container-open";
			containerName += this.props.rightPaneActive ? " right-pane-active" : "";

			return (
				<div className={containerName} >
					<img className="swap-button" src={swapIcon} onClick={this.props.swap} alt="Swap Button"/>
					<img className="minimize-button" src={plusIcon} onClick={this.props.minimize} alt="Minimize Button" />
					<WrappedComponent {...this.props as P} />
				</div>
			);
		}
	}
};


export default asSmallWorkspace;

