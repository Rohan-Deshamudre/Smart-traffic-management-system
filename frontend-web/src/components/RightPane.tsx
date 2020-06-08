import * as React from 'react';
import { Subtract } from 'utility-types';

import "./styles/pane.scss"
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

interface PRightPane {
    active: boolean
    toggle: () => void
    paneName: string
    icon: string
}

export default function asRightPane(WrappedComponent) {
    return function (props) {
        const { active } = props as PRightPane;
        return (
            <div>
                {!active
                    ? (
                        <div className="open-pane-button right" onClick={props.toggle}>
                            <img src={props.icon} alt={""} />
                            <div className="description">{props.paneName}</div>
                        </div>
                    ) : null
                }
                <div
                    className={(active ? "active-right-pane " : "inactive-right-pane ") + "rightpane-container pane-container"}>
                    <div className="close-pane-button right" onClick={props.toggle}>
                        <img src={closeIcon} alt="x" />
                    </div>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );

    }
}
