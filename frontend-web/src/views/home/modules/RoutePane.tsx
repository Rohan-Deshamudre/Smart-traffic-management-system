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
            <div>
                    <p>Does this appear?</p>
            </div>
        );
    }

}

export default asRoutesPane(RoutePane)

