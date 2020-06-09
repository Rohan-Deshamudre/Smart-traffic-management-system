import * as React from 'react';
import { Subtract } from 'utility-types';

import "./styles/pane.scss"
// @ts-ignore
import scenarioIcon from "../assets/node_icons/scenario.svg";
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

interface PLeftPane {
    active: boolean;
    toggle: () => void;
    paneName: string
    icon: string
}

export default function asLeftPane(WrappedComponent) {
    return function (props) {
        const { active } = props as PLeftPane;

        return (
            <div>
                {!active ? (
                    <div className="open-pane-button left" onClick={props.toggle}>
                        <div className="description">{props.paneName}</div>
                        <img src={props.icon} alt={""} />
                    </div>
                ) : null}
                <div className={(active ? "active-left-pane " : "inactive-left-pane ") + "leftpane-container pane-container"}>
                    <div className="close-pane-button left" onClick={props.toggle}>
                        <img src={closeIcon} alt="x" />
                    </div>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    }
}
