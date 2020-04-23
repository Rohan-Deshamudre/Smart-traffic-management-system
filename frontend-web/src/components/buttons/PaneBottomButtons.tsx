import * as React from 'react';
import Button from "react-bootstrap/Button";
import "./styles/paneBottomButtons.scss"
import {Link} from "react-router-dom";
import {ApolloConsumer, Query} from 'react-apollo';
import ExportTree from "../../views/scenario-designer/components/ExportTree";
import gql from "graphql-tag";
// @ts-ignore
import simIcon from "./../../assets/navbar_icons/play.svg"
// @ts-ignore
import undoIcon from "./../../assets/undo.svg"
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

type LPBBProps = {
	middleButtonURL: string
}

class PaneBottomButtons extends React.Component<LPBBProps, {}> {

	render() {
		const string = this.props.middleButtonURL;
		let middle;
		if (string === "simulator") {
			middle = <img src={simIcon} alt="Simuleer"/>
		} else {
			middle = string.charAt(0).toUpperCase() + string.slice(1);
		}


		return (
			<div className="d-flex justify-content-between pane-bottom-buttons">
				<div>
					<Query query={gql`{currentTreeId @client}`}>
						{({data}) => {
							return (<ExportTree scenarioId={data.currentTreeId}/>);
						}}
					</Query>
				</div>

				<div>
					<Link to={"/" + string}>
						<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Simuleer
							scenario</Tooltip>}>
							<Button className="remove-borders">{middle}</Button>
						</OverlayTrigger></Link>
				</div>

				<div>
					<Link to="/">
						<ApolloConsumer>
							{client => (
								<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Terug</Tooltip>}>
									<Button onClick={() =>
										client.writeData({
											data: {
												currentTreeId: null,
												curNodeId: -1,
												curNodeType: null,
											}
										})}><img src={undoIcon} alt="Terug"/></Button>
								</OverlayTrigger>
							)}
						</ApolloConsumer>
					</Link>
				</div>
			</div>
		);
	}
}

export default PaneBottomButtons;
