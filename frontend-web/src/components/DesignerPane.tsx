import * as React from "react";
import {Subtract} from "utility-types";
// @ts-ignore
import closeIcon from "../assets/left-collapse.svg";

export interface InjectedDesignerPane {
    
}

interface PDesignerPane {
    active: boolean;
    toggle: () => void;
    paneName: string
    icon: string
}

interface SDesignerPane {
    // Add state here
}

const asDesignerPane = <P extends InjectedDesignerPane>(
    WrappedComponent: React.ComponentType<P>
) => {

    return class AsDesignerPane extends React.Component<
        Subtract<P, InjectedDesignerPane> & PDesignerPane, // Substract so the wrappedcomponent cannot be initialized
        SDesignerPane
        > {

        constructor(props) {
            super(props);
        }

        render() {
            const { active } = this.props as PDesignerPane;

            return (
                <div>
                    { !active ? (
                        <div className="open-pane-button des" onClick={this.props.toggle}>
                            <div className="description">{this.props.paneName}</div>
                            <img src={this.props.icon} alt={""} />
                        </div>
                    ) : null }
                    <div className={(active ? "active-left-pane " : "inactive-left-pane ") + "leftpane-container pane-container"}>
                        <div className="close-pane-button des" onClick={this.props.toggle}>
                            <img src={closeIcon} alt="x" />
                        </div>
                        <WrappedComponent {...this.props as P} />
                    </div>
                </div>
            );

        }
    }
};

export default asDesignerPane;