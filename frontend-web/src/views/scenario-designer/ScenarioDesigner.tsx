import * as React from 'react';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import LeftPane from "./modules/LeftPane";
import RightPane from "./../home/modules/RightPane";
import ScenarioPane from "./../home/modules/LeftPane";
import { Query } from 'react-apollo';
import { READ_FOLDERS } from "../../components/CRUDFolders";
import gql from "graphql-tag";

// @ts-ignore
import instrumentsIcon from "./../../assets/node_icons/instruments.svg";
// @ts-ignore
import editorIcon from "./../../assets/node_icons/designer.svg";
import { Redirect } from 'react-router-dom';
import { Auth } from '../../helper/auth';
// @ts-ignore
import scenarioIcon from "../../assets/node_icons/scenario.svg";

interface State {
	leftPaneActive: boolean;
	rightPaneActive: boolean;
	scenarioPaneActive: boolean;
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
			scenarioPaneActive: false
		};

		this.toggleLeftPane = this.toggleLeftPane.bind(this);
		this.toggleRightPane = this.toggleRightPane.bind(this);
		this.toggleScenarioPane = this.toggleScenarioPane.bind(this);

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

	toggleScenarioPane() {
		this.setState({
			scenarioPaneActive: !this.state.scenarioPaneActive
		})
	}

	render() {
		if (!Auth.isEngineer()) {
			return <Redirect to="/" />
		}
		return (
			<div className="view scenario-designer-view">
				<NavBar mode="ScenarioDesigner" />

				<Workspace
					smallWorkspaceDeactivated={false}
					rightPaneActive={this.state.rightPaneActive}
				/>
				<div className="home-container structure-container">
					<Query query={GET_DESIGNER_DATA}>
						{
							/** Illustrate the data, such as road segment type, on
							 *  the designer pane
							 */
							({ data }) => (
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

					<Query query={READ_FOLDERS}>
						{
							({ loading, error, data }) => {
								if (loading) return <div className="container-center"><div className="loader"></div></div>;
								if (error) {
									console.log(error)
									return <div>Error</div>;
								}

								/** Obtain the scenarios and folders */
								const scenarioFolders = data.folders
									.filter((folder: any) => folder.folderType.id === '1');
								const scenariosWithoutFolders = data.scenarios
									.filter((scenario: any) => scenario.folder === null);

								/** The instruments menu stays the same */
								return (
									<div className="home-container structure-container">
									<ScenarioPane
										paneName="Scenario's"
										icon={scenarioIcon}
										toggle={this.toggleScenarioPane}
										active={this.state.scenarioPaneActive}
										folders={scenarioFolders}
										scenarios={scenariosWithoutFolders}
										boundingBox={data.boundingBox}
									/>

									<RightPane
										paneName="Instrumenten" icon={instrumentsIcon}
										toggle={this.toggleRightPane}
										active={this.state.rightPaneActive}
										instruments={data.instruments}
										instrumentTypes={data.instrumentTypes}
										currDrip={data.currDripId}
										boundingBox={data.boundingBox}
									/>

									</div>
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
