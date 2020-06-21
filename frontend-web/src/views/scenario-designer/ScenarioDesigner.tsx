import * as React from 'react';
import { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import InsightsPane from "../scenario-simulator/modules/InsightsPane"
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
// @ts-ignore
import insightsIcon from '../../assets/insights.svg';
import { Redirect } from 'react-router-dom';
import { Auth } from '../../helper/auth';
// @ts-ignore
import scenarioIcon from "../../assets/node_icons/scenario.svg";

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

export const GET_INSIGHTS_DATA = gql`
    {
        currentInsights @client
    }
`;

export default function ScenarioDesigner(props: Props) {
    const [leftPaneActive, setLeftPaneActive] = useState(false);
    const [rightPaneActive, setRightPaneActive] = useState(false);
    const [insightsPaneActive, setInsightsPaneActive] = useState(false);
    const [scenarioPaneActive, setScenarioPaneActive] = useState(true);

    const designerData = (() => {
        const { data } = useQuery(GET_DESIGNER_DATA);
        return data;
    })();

    const insightsLog = (() => {
        const { data } = useQuery(GET_INSIGHTS_DATA);
        let events = [];
        try { events = JSON.parse(data.currentInsights); } catch (_) { }
        return [{ 'simulationSceneEvents': events }];
    })();

    function toggleLeftPane() {
        setScenarioPaneActive(false);
        setLeftPaneActive(!leftPaneActive);
    }

    function toggleRightPane() {
        setRightPaneActive(!rightPaneActive);
    }

    function toggleInsightsPane() {
        setInsightsPaneActive(!insightsPaneActive);
    }

    function toggleScenarioPane() {
        setLeftPaneActive(false);
        setScenarioPaneActive(!scenarioPaneActive);
    }

    if (!Auth.isEngineer()) {
        return <Redirect to="/" />
    }
    return (
        <div className="view scenario-designer-view">
            <NavBar mode="ScenarioDesigner" />

            <Workspace
                smallWorkspaceDeactivated={false}
                rightPaneActive={rightPaneActive}
            />
            <div className="home-container structure-container">
                <LeftPane paneName="Designer"
                    readOnly={false}
                    icon={editorIcon}
                    toggle={toggleLeftPane}
                    data={designerData}
                    active={leftPaneActive}
                />

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
                                        toggle={toggleScenarioPane}
                                        active={scenarioPaneActive}
                                        folders={scenarioFolders}
                                        scenarios={scenariosWithoutFolders}
                                        boundingBox={data.boundingBox}
                                    />

                                    <InsightsPane paneName="Insights"
                                        icon={insightsIcon}
                                        toggle={toggleInsightsPane}
                                        active={insightsPaneActive}
                                        simulationLog={insightsLog}
                                        messageSocket={null}
                                        boundingBox={data.boundingBox}
                                    />


                                    <RightPane
                                        paneName="Instrumenten" 
                                        icon={instrumentsIcon}
                                        toggle={toggleRightPane}
                                        active={rightPaneActive}
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
