import * as React from 'react';
import { Subtract } from 'utility-types';

import Map from "./map/Map";
import Tree from "./tree/Tree";
import "./styles/workspace.scss";

import { Query } from "react-apollo";
import { GET_TREE, GET_WORKSPACE_DATA } from "./workspaceData";
import { treeUtils } from "./tree/treeUtils";

export interface InjectedPWorkspace {
	// Add props here
}

type PWorkspace = {
	rightPaneActive: boolean
	smallWorkspaceDeactivated?: boolean
}

type SWorkspace = {
	lng: number,
	lat: number,
	minimized: boolean,
	zoom: number,
}

const asWorkspace = <P extends InjectedPWorkspace>(WrappedComponent: React.ComponentType<P>) => {

	return class AsWorkspace extends React.Component<Subtract<P, InjectedPWorkspace> & PWorkspace, // Substract so the wrappedcomponent cannot be initialized
		SWorkspace> {

		constructor(props: Subtract<P, InjectedPWorkspace> & PWorkspace) {
			super(props);
			this.state = {
				lng: 4.4631786,
				lat: 51.9228934,
				minimized: false,
				zoom: 12,
			};

			this.swap = this.swap.bind(this);
			this.setMapStatus = this.setMapStatus.bind(this);
			this.minimize = this.minimize.bind(this);
		}

		setMapStatus(lat: number, lng: number, zoom: number): void {
			this.setState({
				lng: lng,
				lat: lat,
				zoom: zoom
			})
		}

		swap(swapped, client) {
			client.writeData({
				data: { workspaceSwapped: !swapped }
			});
		}

		minimize(): void {
			this.setState({
				minimized: !this.state.minimized
			})
		}

		render() {
			let id = undefined;
			let treeIsUpToDate;
			let instruments;
			let treeTransform;
			let mapLocation;
			let visibleInstruments;
			let instrumentActionRoutes;
			let selectedInstrumentActionRoutes;
			let selectedRoute;
			let alternativeRoute;
			let treeLevel;
			let swapped;

			return (<Query query={GET_WORKSPACE_DATA}>
				{({ loading, error, data, client }) => {
					if (loading) return <div className="container-center"><div className="loader"></div></div>;
					if (error) {
						console.log(error)
						return <div>Error</div>;
					}

					treeTransform = {
						k: data.treeTransform[0],
						x: data.treeTransform[1],
						y: data.treeTransform[2]
					};

					instruments = data.instruments;
					instrumentActionRoutes = data.instrumentActionRoutes;
					visibleInstruments = data.visibleInstruments;
					id = data.currentTreeId;
					treeIsUpToDate = data.treeIsUpToDate;
					selectedRoute = data.selectedRoute;
					alternativeRoute = data.alternativeRoute;
					console.log(alternativeRoute)
					mapLocation = data.mapLocation;
					treeLevel = data.treeLevel;
					selectedInstrumentActionRoutes = data.selectedInstrumentActionRoutes;
					swapped = data.workspaceSwapped;

					if (data.curNodeType !== "RoadConditionObjectType") {
						client.writeData({
							data: {
								selectedInstrumentActionRoutes: []
							}
						});
						selectedInstrumentActionRoutes = [];
					}

					return (
						<div className="workspace-container">
							<Query query={GET_TREE} variables={{ id }} skip={!id}>
								{({ loading, error, data, client }) => {
									if (loading) return <div className="container-center"><div className="loader"></div></div>;
									if (error) {
										console.log(error)
										return <div>Error</div>;
									}

									let scenario = undefined;
									let deactivatedNodes = undefined;

									if (data !== undefined) {
										[scenario, deactivatedNodes] = treeUtils.transformData(data.scenarios[0], client);
										deactivatedNodes = deactivatedNodes.map(node => ({ id: node.id, typename: node.__typename }));
										instrumentActionRoutes = data.instrumentActions.map((instrAct) => instrAct.routes.map(route => route.routePoints.map(routePoint => [routePoint.lng, routePoint.lat]))).flat();
									}

									const largeMap = (
										<Map.Large scenario={scenario}
											instruments={instruments}
											instrumentActionRoutes={instrumentActionRoutes}
											selectedInstrumentActionRoutes={selectedInstrumentActionRoutes}
											selectedRoute={selectedRoute}
											alternativeRoute = {alternativeRoute}
											visibleInstruments={visibleInstruments}
											client={client}
											mapLocation={mapLocation}
											setMapStatus={this.setMapStatus}
											lng={this.state.lng}
											lat={this.state.lat}
											zoom={this.state.zoom} />
									);

									return this.props.smallWorkspaceDeactivated ? (
										largeMap
									) : (
											<div className="workspace-content">
												{swapped ?
													<Tree.Small rightPaneActive={this.props.rightPaneActive}
														upToDate={treeIsUpToDate} client={client}
														scenario={scenario} minimized={this.state.minimized}
														swap={() => this.swap(swapped, client)} minimize={this.minimize}
														treeTransform={treeTransform}
														deactivatedNodes={deactivatedNodes}
														treeLevel={treeLevel}
													/>
													:
													<Tree.Large upToDate={treeIsUpToDate} client={client}
														scenario={scenario} treeTransform={treeTransform}
														deactivatedNodes={deactivatedNodes}
														treeLevel={treeLevel}
													/>
												}
												{swapped ?
													largeMap
													:
													<Map.Small rightPaneActive={this.props.rightPaneActive}
														scenario={scenario}
														instruments={instruments}
														instrumentActionRoutes={instrumentActionRoutes}
														selectedInstrumentActionRoutes={selectedInstrumentActionRoutes}
														selectedRoute={selectedRoute}
														alternativeRoute = {alternativeRoute}
														visibleInstruments={visibleInstruments}
														client={client}
														mapLocation={mapLocation}
														setMapStatus={this.setMapStatus}
														lng={this.state.lng}
														lat={this.state.lat}
														zoom={this.state.zoom}
														minimized={this.state.minimized}
														swap={() => this.swap(swapped, client)}
														minimize={this.minimize} />
												}
											</div>
										)
								}}
							</Query>
							<WrappedComponent {...this.props as P} />
						</div>
					)
				}}
			</Query>
			)
		};
	}
};


export default asWorkspace;
