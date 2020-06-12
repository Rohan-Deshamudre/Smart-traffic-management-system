import * as React from 'react';
import { useState, useEffect } from 'react';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import InsightsPane from "./modules/InsightsPane"
import LeftPane from "../scenario-designer/modules/LeftPane";
import ScenarioPane from "../home/modules/LeftPane";
import RightPane from "./modules/RightPane";
import { ApolloConsumer, Query } from 'react-apollo';
import { GET_WORKSPACE_DATA, GET_TREE } from '../../components/workspaceData';
import { READ_FOLDERS } from '../../components/CRUDFolders';
import * as moment from 'moment';

// @ts-ignore
import simulationIcon from '../../assets/node_icons/simulations.svg';
// @ts-ignore
import insightsIcon from '../../assets/insights.svg';
// @ts-ignore
import scenarioIcon from "../../assets/node_icons/scenario.svg";
// @ts-ignore
import editorIcon from "./../../assets/node_icons/designer.svg";
import { GET_DESIGNER_DATA } from "../scenario-designer/ScenarioDesigner";
import { Redirect } from 'react-router-dom';
import { Auth } from '../../helper/auth';


interface Props {

}

export default function ScenarioSimulator(props: Props) {
    const [ws, _] = useState(new WebSocket(process.env.SIMULATION_URL));
    const [leftPaneActive, setLeftPaneActive] = useState(false);
    const [rightPaneActive, setRightPaneActive] = useState(true);
    const [scenarioPaneActive, setScenarioPaneActive] = useState(true);
    const [insightsPaneActive, setInsightsPaneActive] = useState(false);
    const [simulationStatus, setSimulationStatus] = useState({});
    const [simulationLog, setSimulationLog] = useState([]);

    function sendMessage(message, description = "Ongespecificeerd bericht naar de server") {
        setSimulationLog([...simulationLog, { time: 'Systeem', text: description }])
        ws.send(message);
    }

    function toggleLeftPane() {
        setLeftPaneActive(!leftPaneActive);
    }

    function toggleRightPane() {
        setRightPaneActive(!rightPaneActive);
    }

    function toggleScenarioPane() {
        setScenarioPaneActive(!scenarioPaneActive);
    }

    function toggleInsightsPane() {
        setInsightsPaneActive(!insightsPaneActive);
    }

    function replaceLiveId(message) {
        if (message.simulationSceneEvents !== undefined) {
            let i = 0;
            message.simulationSceneEvents = message.simulationSceneEvents.map(event => ({ ...event, id: i++ }));
        }
        return message;
    }

    ws.onopen = () => setSimulationLog([{ time: 'Systeem', text: "Connectie gemaakt" }]);

    ws.onmessage = evt => {
        console.log(evt.data);
        const message = JSON.parse(evt.data);
        if (!message['text']) {
            setSimulationStatus(message.id == -1 ? replaceLiveId(message) : message);
            setSimulationLog([...simulationLog, { time: moment(message.time).format('HH:mm:ss'), simulationSceneEvents: message.simulationSceneEvents }]);
        }
    };

    ws.onclose = () => setSimulationLog([...simulationLog, { time: 'Systeem', text: "Connectie verbroken" }]);

    useEffect(() => {
        return () => ws.close();
    }, []);

    if (!Auth.isEngineer()) {
        return <Redirect to="/" />
    }
    return (
        <div className="view scenario-simulator-view">
            <NavBar mode="ScenarioSimulator" />

            <ApolloConsumer>
                {client =>
                    <Workspace rightPaneActive={rightPaneActive}
                        simulationStatus={simulationStatus}
                        client={client}
                    />
                }
            </ApolloConsumer>

            <div className="home-container structure-container">
                <Query query={GET_DESIGNER_DATA}>
                    {
                        ({ data }) => (
                            <LeftPane paneName="Designer"
                                readOnly
                                icon={editorIcon}
                                toggle={toggleLeftPane}
                                data={data}
                                active={leftPaneActive}
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

                            return (
                                <ScenarioPane
                                    paneName="Scenario's"
                                    icon={scenarioIcon}
                                    toggle={toggleScenarioPane}
                                    active={scenarioPaneActive}
                                    folders={scenarioFolders}
                                    scenarios={scenariosWithoutFolders}
                                    boundingBox={data.boundingBox}
                                />
                            );
                        }
                    }
                </Query>

                <Query query={GET_WORKSPACE_DATA}>
                    {
                        ({ loading, error, data }) => {
                            if (loading) return <div>Fetching</div>;
                            if (error) return <div>Error</div>;

                            const id = data.currentTreeId;
                            return (
                                <div className="home-container structure-container">
                                    <InsightsPane paneName="Insights"
                                        icon={insightsIcon}
                                        toggle={toggleInsightsPane}
                                        active={insightsPaneActive}
                                        simulationLog={simulationLog}
                                        messageSocket={sendMessage}
                                        boundingBox={data.boundingBox}
                                    />

                                    <RightPane paneName="Simulaties"
                                        icon={simulationIcon}
                                        toggle={toggleRightPane}
                                        active={rightPaneActive}
                                        simulationLog={simulationLog}
                                        messageSocket={sendMessage}
                                        scenarioId={id}
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
