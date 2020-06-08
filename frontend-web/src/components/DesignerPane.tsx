import * as React from "react";
import { Subtract } from "utility-types";
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

interface PDesignerPane {
    active: boolean;
    toggle: () => void;
    paneName: string
    icon: string
}

export default function asDesignerPane(WrappedComponent) {
    return function (props) {
        const { active } = props as PDesignerPane;

        return (
            <div>
                {!active ? (
                    <div className="open-pane-button des" onClick={props.toggle}>
                        <div className="description">{props.paneName}</div>
                        <img src={props.icon} alt={""} />
                    </div>
                ) : null}
                <div className={(active ? "active-left-pane " : "inactive-left-pane ") + "leftpane-container pane-container"}>
                    <div className="close-pane-button des" onClick={props.toggle}>
                        <img src={closeIcon} alt="x" />
                    </div>
                    <WrappedComponent {...props} />
                </div>
            </div>
        );
    }
}
