import * as React from 'react';
import { Subtract } from 'utility-types';

import './../styles/workspace.scss'

export interface InjectedPLargeWorkspace {
	// Add props here
}

type PLargeWorkspace = {

}

type SLargeWorkspace = {
	// Add state here
}

const asLargeWorkspace = <P extends InjectedPLargeWorkspace>(
	WrappedComponent: React.ComponentType<P>
) => {

	return class AsLargeWorkspace extends React.Component<
		Subtract<P, InjectedPLargeWorkspace> & PLargeWorkspace, // Substract so the wrappedcomponent cannot be initialized
		SLargeWorkspace
		> {

		render() {
			return (
				<div className="large-workspace-container">
					<WrappedComponent {...this.props as P} />
				</div>
			);
		}
	}
};


export default asLargeWorkspace;

