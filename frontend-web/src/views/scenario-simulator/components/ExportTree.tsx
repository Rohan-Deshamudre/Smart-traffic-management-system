import * as React from 'react';
import Button from "react-bootstrap/Button";
import axios from 'axios'
// @ts-ignore
import downloadIcon from "./../../../assets/home_left_pane/download.svg"
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

//
type Props = {
    scenarioId: number;
}

export default function ExportTree(props: Props) {
    let handleSubmit = () => {
        if (props.scenarioId !== null) {
            axios.post(process.env.RESPONSE_PLAN_EXPORT, { scenario_id: props.scenarioId })
                .then(res => {
                    const blob = new Blob([JSON.stringify(res.data)], { type: "text/json;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'response_plan_scenario_' + props.scenarioId + '.json';
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

    return (
        <OverlayTrigger key='top' overlay={
            <Tooltip id='tooltip-top'>Download response plan</Tooltip>
        }>
            <Button onClick={handleSubmit} className="remove-border-left">
                <img src={downloadIcon} alt="Download" />
            </Button>
        </OverlayTrigger>
    )
}
