import * as React from 'react';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import LeftPane from "./modules/LeftPane";
import RightPane from "./../home/modules/RightPane";
import InsightsPane from "./modules/InsightsPane";
import {Query} from 'react-apollo';
import {READ_FOLDERS} from "../../components/CRUDFolders";
import {schema} from "../../local_store/schema";
import gql from "graphql-tag";

// @ts-ignore
import instrumentsIcon from "./../../assets/node_icons/instruments.svg";
// @ts-ignore
import editorIcon from "./../../assets/node_icons/designer.svg";

interface State {
	leftPaneActive: boolean;
	rightPaneActive: boolean;
	insightsPaneActive: boolean;
}

interface Props {

}

export const GET_DESIGNER_DATA = gql`
    {
        curNodeId @client
        curNodeType @client
        parentInfo @client
        currentTreeId @client
    }
`;

class ScenarioDesigner extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			leftPaneActive: false,
			rightPaneActive: false,
			insightsPaneActive: false,
		};

		this.toggleLeftPane = this.toggleLeftPane.bind(this);
		this.toggleRightPane = this.toggleRightPane.bind(this);
		this.toggleInsightsPane = this.toggleInsightsPane.bind(this);
	}

	toggleLeftPane() {
		this.setState({
			leftPaneActive: !this.state.leftPaneActive
		})
	}

	toggleRightPane() {
		this.setState({
			rightPaneActive: !this.state.rightPaneActive
		})
	}

	toggleInsightsPane() {
		this.setState({
			insightsPaneActive: !this.state.insightsPaneActive
		})
	}

	render() {
		return (
			<div className="view scenario-designer-view">
				<NavBar mode="ScenarioDesigner" />

				<div className="home-container structure-container">
					<Query query={GET_DESIGNER_DATA}>
						{
							/** Illustrate the data, such as road segment type, on
							 *  the designer pane
							 */
							({data}) => (
								<LeftPane paneName="Designer"
										readOnly={false}
										icon={editorIcon}
										toggle={this.toggleLeftPane} 
										data={data}
										active={this.state.leftPaneActive}
								/>
							)
						}
					</Query>

					<Query query={schema}>
						{
							({data}) => (
								<InsightsPane paneName="Insights"
											readOnly={false}
											icon={editorIcon}
											toggle={this.toggleInsightsPane}
											data={data}
											active={this.state.insightsPaneActive}
								/>
							)
						}
					</Query>

					<Workspace 
						smallWorkspaceDeactivated={false}
						rightPaneActive={this.state.rightPaneActive}
					/>

					<Query query={READ_FOLDERS}>
						{
							({loading, error, data}) => {
								if (loading) return <div>Fetching</div>;
								if (error) return <div>Error</div>;
								
								/** The instruments menu stays the same */
								return (
									<RightPane paneName="Instrumenten"
											icon={instrumentsIcon}
											toggle={this.toggleRightPane} 
											active={this.state.rightPaneActive}
											instruments={data.instruments} 
											instrumentTypes={data.instrumentTypes}
											currDrip={data.currDripId} 
											boundingBox={data.boundingBox}
									/>
								);
							}
						}
					</Query>
				</div>
			</div>
		);
	}
}

export default ScenarioDesigner;
