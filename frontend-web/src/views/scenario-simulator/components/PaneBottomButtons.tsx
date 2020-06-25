import * as React from 'react';
import Button from "react-bootstrap/Button";
import "../../../components/buttons/styles/paneBottomButtons.scss";
import {Link} from "react-router-dom";
import {ApolloConsumer, Query} from 'react-apollo';
import ExportTree from "./ExportTree";
import gql from "graphql-tag";
// @ts-ignore
import undoIcon from "./../../../assets/undo.svg"
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";


class PaneBottomButtons extends React.Component<{}, {}> {

	render() {
		return (
			<div className="d-flex justify-content-between pane-bottom-buttons">
				<div>
					<Query query={gql`{currentTreeId @client}`}>
						{({data}) => {
                            return (
                                <ExportTree scenarioId={data.currentTreeId} />
							);
						}}
					</Query>
				</div>

				<div>
					<Link to="/">
						<ApolloConsumer>
							{client => (
								<OverlayTrigger key='top' overlay={
									<Tooltip id='tooltip-top'>Terug</Tooltip>
								}>
									<Button onClick={() =>
										client.writeData({
											data: {
												currentTreeId: null,
												curNodeId: -1,
												curNodeType: null,
											}
										})}
									>
										<img src={undoIcon} alt="Terug"/>
									</Button>
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
