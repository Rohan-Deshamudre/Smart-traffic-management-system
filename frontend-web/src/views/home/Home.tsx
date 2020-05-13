// import React, {Component} from 'react';
import * as React from 'react';

import NavBar from "./modules/NavBar";
import Workspace from "./modules/Workspace";
import LeftPane from "./modules/LeftPane";
import RightPane from "./modules/RightPane";
import RoutePane from "./modules/RoutePane";

import "./../../components/styles/structure.scss"
import {Query} from 'react-apollo';
import { READ_FOLDERS } from "../../components/CRUDFolders";

// @ts-ignore
import scenarioIcon from "../../assets/node_icons/scenario.svg";
// @ts-ignore
import instrumentsIcon from "../../assets/node_icons/instruments.svg";
// @ts-ignore
import insightsIcon from '../../assets/insights.svg';

interface State {
    leftPaneActive: boolean;
    rightPaneActive: boolean;
    routePaneActive: boolean;
}

interface Props {
}

class Home extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            leftPaneActive: true,
            rightPaneActive: true,
            routePaneActive: false
        };

        this.toggleLeftPane = this.toggleLeftPane.bind(this);
        this.toggleRightPane = this.toggleRightPane.bind(this);
        this.toggleRoutePane = this.toggleRoutePane.bind(this);
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

    toggleRoutePane() {
        this.setState({
            routePaneActive: !this.state.routePaneActive
        })
    }

    render() {
        return (
            <div className="view home-view">
                <NavBar mode="Home mode" />
                
                <Query query={READ_FOLDERS}>
                    {
                        ({loading, error, data, client}) => {
                            client.writeData({
                                data: {
                                    currentTreeId: null,
                                    curNodeId: -1,
                                    curNodeType: null,
                                    workspaceSwapped: true
                                }
                            });

                            if (loading) return <div>Fetching</div>;
                            if (error) return <div>Error</div>;
                            
                            /** Obtain the scenarios and folders */
                            const scenarioFolders = data.folders
                                .filter((folder: any) => folder.folderType.id === '1');
                            const scenariosWithoutFolders = data.scenarios
                                .filter((scenario: any) => scenario.folder === null);

                            /**
                             * Setting the left (designer) and right (intruments) toggle menus
                             */
                            return (
                                <div className="home-container structure-container">
                                    <LeftPane icon={scenarioIcon}
                                            paneName="Scenario's"
                                            toggle={this.toggleLeftPane}
                                            active={this.state.leftPaneActive}
                                            folders={scenarioFolders}
                                            scenarios={scenariosWithoutFolders}
                                            boundingBox={data.boundingBox}
                                    />

                                    <RoutePane icon={insightsIcon}
                                               paneName = "Routes"
                                               toggle={this.toggleRoutePane}
                                               active = {this.state.routePaneActive}
                                    />

                                    <Workspace
                                        smallWorkspaceDeactivated={true}
                                        rightPaneActive={this.state.rightPaneActive}
                                    />
                                    
                                    <RightPane icon={instrumentsIcon}
                                            paneName="Instrumenten"
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
        );
    }
}

export default Home;
