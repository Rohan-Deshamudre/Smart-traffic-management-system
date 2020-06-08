import * as React from 'react';
import { Subtract } from 'utility-types';

import "./styles/pane.scss"
// @ts-ignore
import scenarioIcon from "../assets/node_icons/scenario.svg";
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

interface InsPane {
    active: boolean;
    toggle: () => void;
    paneName: string
    icon: string
}

export default function asInsightsPane(WrappedComponent) {
    return function (props) {
        const { active } = props as InsPane;

        return (
            <div>
                {!active ? (
                    <div className="open-pane-button insights" onClick={props.toggle}>
                        <div className="description">{props.paneName}</div>
                        <img src={props.icon} alt={""} />
                    </div>
                ) : null}
                <div className={(active ? "active-insights-pane " : "inactive-insights-pane ") + " insightspane-container"}>
                    <div className="close-pane-button insights" onClick={props.toggle}>
                        <img src={closeIcon} alt="x" />
                    </div>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    }
}

