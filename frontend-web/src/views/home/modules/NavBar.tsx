import * as React from 'react';
import '../styles/NavBar.scss';

import asNavBar, {InjectedPNavBar} from "../../../components/NavBar";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

interface Props extends InjectedPNavBar {
}

interface State {
}

class NavBar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }


    render() {
        return null;
    }
}

export default asNavBar(NavBar);
