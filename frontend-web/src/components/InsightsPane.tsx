import * as React from 'react';
import {Subtract} from 'utility-types';

import "./styles/pane.scss";
// @ts-ignore
import scenarioIcon from "../assets/node_icons/scenario.svg";
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

export interface InjectedInsightsPane {

}

interface InsightsPane {
    active: boolean
    toggle: () => void
    paneName: string
    icon: string
}

interface SInsightsPane {
    //Add state
}

const asInsightsPane = <P extends InjectedInsightsPane>(
    WrappedComponent: React.ComponentType<P>
) => {

    return class AsInsightsPane extends React.Component<
        Subtract<P, InjectedInsightsPane> & InsightsPane, // Subtract so the wrapped component cannot be initialized
		SInsightsPane> {

        constructor(props) {
            super(props);
        }

		render() {
            const {active} = this.props as InsightsPane;
            
			return (
				<div>
                    {
                        !active ? (
                            <div className="open-pane-button insights" onClick={this.props.toggle}>
                                <div className="description">{this.props.paneName}</div>
                                <img src={this.props.icon} alt={""} />
                            </div>
                        ) : null
					}
					<div
						className={(active ? "active-insights-pane " : "inactive-insights-pane ") + " insightspane-container"}>
						<div className="close-pane-button insights" onClick={this.props.toggle}>
							<img src={closeIcon} alt="x" />
						</div>
						<WrappedComponent {...this.props as P} />
					</div>
				</div>
			);
		}
	}
}

export default asInsightsPane;
