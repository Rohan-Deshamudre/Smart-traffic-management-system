import * as React from "react";
import asRoutesPane from "../../../components/RoutePane";

type State = {
    route?: { id: number, lng: number, lat: number }[],
}

type Props ={}


class RoutePane extends React.Component<Props, State, any> {
    constructor(props: Props) {
        super(props);

    }

    render() {
        return(
            <div className="pane left-pane designer">
                <div className="pane-header">
                    <div className="d-block header-title">Plan your route:</div>
                </div>
                <br/>
                <div className="mid">
                    <p>This is where the lat long shit should go</p>
                </div>

            </div>
        );
    }

}

export default asRoutesPane(RoutePane)
