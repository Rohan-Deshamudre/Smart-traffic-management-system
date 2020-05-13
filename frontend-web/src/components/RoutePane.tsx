import * as React from "react";
import {Subtract} from "utility-types";
import "./styles/pane.scss"

// @ts-ignore
import closeIcon from "../assets/left-collapse.svg"


export interface InjectedRoutesPane {
}

interface RoutesPane {
    active: boolean;
    toggle: () => void;
    paneName: string
    icon: string
}

interface RoutesPane {
    // Add state here
}

const asRoutesPane = <P extends InjectedRoutesPane>(
    WrappedComponent: React.ComponentType<P>
) => {

    return class asRoutesPane extends React.Component<
        Subtract<P, InjectedRoutesPane> & RoutesPane, // Substract so the wrappedcomponent cannot be initialized
        RoutesPane
        > {

        constructor(props) {
            super(props);


        }

        render() {
            const { active } = this.props as RoutesPane;

            return (
                <div>
                    {!active ? (
                <div className="open-pane-button insights" onClick={this.props.toggle}>
            <div className="description">{this.props.paneName}</div>
                <img src={this.props.icon} alt={""} />
            </div>
        ) : null}
            <div className={(active ? "active-insights-pane " : "inactive-insights-pane ") + " insightspane-container"}>
            <div className="close-pane-button insights" onClick={this.props.toggle}>
            <img src={closeIcon} alt="x" />
                </div>
                <WrappedComponent {...this.props as P} />
            </div>
            </div>
        );

        }
    }
};


export default asRoutesPane;
