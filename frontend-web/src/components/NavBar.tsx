import * as React from 'react';
import {Subtract} from 'utility-types';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import {ApolloConsumer, Query} from "@apollo/react-components";

import {Link} from "react-router-dom";
import FormControl from "react-bootstrap/FormControl";
import gql from "graphql-tag";

import "./styles/navbar.scss"

// @ts-ignore
import home from "../assets/navbar_icons/home.svg";
// @ts-ignore
import location from "./../assets/location.svg";
// @ts-ignore
import simulationIcon from "./../assets/navbar_icons/play.svg";
// @ts-ignore
import designerIcon from "./../assets/navbar_icons/edit.svg";
import TreeLevelButton from "./buttons/TreeLevelButton";


// Info /medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb

export type InjectedPNavBar = {}

type PNavBar = {
	mode?: string
}

type SNavBar = {
	input: string
}

const GET_NAVBAR_DATA = gql`
    query GetNavBarData {
        workspaceSwapped @client
        treeLevel @client
        treeHeight @client
    }
`;

const asNavBar = <P extends InjectedPNavBar>(WrappedComponent: React.ComponentType<P>) => {

	return class AsNavBar extends React.Component<Subtract<P, InjectedPNavBar> & PNavBar, // Substract so the wrappedcomponent cannot be initialized
		SNavBar> {

		constructor(props: Subtract<P, InjectedPNavBar> & PNavBar) {
			super(props);
			this.state = {
				input: ""
			};

			this.handleInput = this.handleInput.bind(this);
			this.handleLevel = this.handleLevel.bind(this);
			this.constructOptionalButton = this.constructOptionalButton.bind(this);
		}

		handleInput(e: React.ChangeEvent<HTMLInputElement>) {
			this.setState({
				input: e.target.value
			});
		}

		handleLevel(level: number, client: any) {
			client.writeData({
				data: {treeLevel: level}
			})
		}

		constructOptionalButton(mode) {
			switch(mode) {
				case "ScenarioDesigner":
					return (
						<div className="nav-button">
							<Link to="/simulator">
								<img src={simulationIcon} alt="Simulator"/>
							</Link>
						</div>
					);
				case "ScenarioSimulator":
					return (
						<div className="nav-button">
							<Link to="/designer">
								<img src={designerIcon} alt="Designer"/>
							</Link>
						</div>
					);
				default:
					return null
			}
		}

		render() {
			let optionalButton = this.constructOptionalButton(this.props.mode);

			return (
				<div className="navbar-container">
					<Query query={GET_NAVBAR_DATA}>
						{({data, client}) => (
							<div className="top-bar">

								{optionalButton}
								<div className="nav-button">
									<Link to="/">
										<img src={home} alt="Home"/>
									</Link>
								</div>
								{
									data.workspaceSwapped === true ?
										(
											<div className="nav-wrap search-wrap">
												<img src={location} alt="Map location icon" className="location-icon"/>
												<FormControl className="form-control" type="text"
															 value={this.state.input}
															 placeholder="Zoek op kaart"
															 onChange={(e) => this.handleInput(e)}
															 onKeyDown={(e) => {
																 if (e.key === 'Enter') {
																	 client.writeData({data: {mapLocation: this.state.input}});
																 }
															 }}/>
											</div>
										) : (
												<TreeLevelButton height={data.treeHeight}
																 handleLevel={(level) => this.handleLevel(level, client)}
																 level={data.treeLevel}/>
										)
								}
							</div>
						)
						}
					</Query>
					<WrappedComponent {...this.props as P} />
				</div>
			);
		}
	}
};


export default asNavBar;

// Info: https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
