import * as React from 'react';
import asNavBar, {InjectedPNavBar} from "../../../components/NavBar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

interface Props extends InjectedPNavBar {
}

type State = {
}


class NavBar extends React.Component<Props, State> {
    render() {
        return null;
    }
}

export default asNavBar(NavBar);
