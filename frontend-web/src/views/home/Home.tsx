import * as React from 'react';
import { useState } from 'react';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import LeftPane from "./modules/LeftPane";
import RightPane from "./modules/RightPane";

import "./../../components/styles/structure.scss"
import { Query } from 'react-apollo';
import { READ_FOLDERS } from "../../components/CRUDFolders";

// @ts-ignore
import scenarioIcon from "../../assets/node_icons/scenario.svg";
// @ts-ignore
import instrumentsIcon from "../../assets/node_icons/instruments.svg";
import { Auth } from '../../helper/auth';
import { Redirect } from 'react-router-dom';

interface Props {
}

export default function Home(props: Props) {
    const [leftPaneActive, setLeftPaneActive] = useState(true);
    const [rightPaneActive, setRightPaneActive] = useState(true);

    function toggleLeftPane() {
        setLeftPaneActive(!leftPaneActive);
    }

    function toggleRightPane() {
        setRightPaneActive(!rightPaneActive);
    }

    if (!Auth.getToken()) {
        return <Redirect to='/login' />
    }

    return (
        <div className="view home-view">
            <NavBar mode="Home mode" />

            <Query query={READ_FOLDERS}>
                {
                    ({ loading, error, data, client }) => {
                        client.writeData({
                            data: {
                                currentTreeId: null,
                                curNodeId: -1,
                                curNodeType: null,
                                workspaceSwapped: true
                            }
                        });

                        if (loading) return <div className="container-center"><div className="loader"></div></div>;
                        if (error) {
                            return <div>Error</div>;
                        }

                        /** Obtain the scenarios and folders */
                        const scenarioFolders = data.folders
                            .filter((folder: any) => folder.folderType.id === '1');
                        const scenariosWithoutFolders = data.scenarios
                            .filter((scenario: any) => scenario.folder === null);

                        /**
                         * Setting the left (designer) and right (intruments) function toggle menus
                         */
                        return (
                            <div className="home-container structure-container">
                                <LeftPane icon={scenarioIcon}
                                    paneName="Scenario's"
                                    toggle={toggleLeftPane}
                                    active={leftPaneActive}
                                    folders={scenarioFolders}
                                    scenarios={scenariosWithoutFolders}
                                    boundingBox={data.boundingBox}
                                />

                                <Workspace
                                    smallWorkspaceDeactivated={true}
                                    rightPaneActive={rightPaneActive}
                                />

                                <RightPane icon={instrumentsIcon}
                                    paneName="Instrumenten"
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
    );
}
