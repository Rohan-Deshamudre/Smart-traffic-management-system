import * as React from 'react';
import Button from "react-bootstrap/Button";
import axios from 'axios'
// @ts-ignore
import downloadIcon from "./../../../assets/home_left_pane/download.svg"
import Tooltip from "react-bootstrap/Tooltip";
import {Link} from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

//
type Props = {
    scenarioId: number;
	responsePlan: string;
}

class ExportTree extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = () => {
        if (this.props.scenarioId !== null) {
            axios.get(process.env.TREE_EXPORT + '?=' + this.props.scenarioId)
                .then(res => {
                    console.log(res.data);

                    const blob = new Blob([JSON.stringify(this.props.responsePlan)], {type: "text/json;charset=utf-8"});
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'insights ' + this.props.scenarioId + '.json';
                    link.href = url;
					link.click();
                })
                .catch(error => {
                    alert('Incorrect ID');
                });
        } else {
            alert('Geen response plan selecteerd');
        }
    }

    render() {
        return(
            <OverlayTrigger key='top' overlay={
                <Tooltip id='tooltip-top'>Download response plan</Tooltip>
            }>
                <Button 
                    onClick={
                        () => {this.handleSubmit()}
                    } 
                    className="remove-border-left"
                >
					<img src={downloadIcon} alt="Download"/>
				</Button>
			</OverlayTrigger>
        )
    }
}

export default ExportTree;
