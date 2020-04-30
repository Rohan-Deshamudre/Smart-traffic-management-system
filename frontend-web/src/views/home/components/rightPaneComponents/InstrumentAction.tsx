import * as React from 'react';
import '../../styles/folder.scss';
import '../../styles/instrument.scss';
import '../../styles/scenarioItem.scss';
import * as _ from 'lodash';

import {Mutation, Query} from 'react-apollo';

// @ts-ignore
import fileIcon from "./../../../../assets/traffic-light.svg";
// @ts-ignore
import editIcon from "./../../../../assets/edit.svg";
// @ts-ignore
import deleteIcon from "./../../../../assets/bin.svg";
import {
	DELETE_INSTRUMENT_ACTION, READ_FOLDERS
} from "../../../../components/CRUDFolders";
import {GET_WORKSPACE_DATA} from "../../../../components/workspaceData";
import DeleteModal from "../../../../components/other/DeleteModal";

type Props = {
	name: string,
	id: number,
	routes: any
	editInstrumentAction: (id: number) => void,
	client: any,
	routesEqualToStore: boolean,
	instrumentLocation: [number, number],
	selectedRouteInStore: [number, number][]
}

type State = {
	openModal: boolean
}

class InstrumentAction extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			openModal: false
		}
	}

	render() {

		let routes = this.props.routes.map((route, index) => (
			<div key={index} className="d-flex justify-content-between align-items-center routes"
				 onClick={() => {
					 this.props.client.writeData({
						 data: {
							 selectedRoute: (_.isEqual(this.props.routes[index], this.props.selectedRouteInStore) ? [] : this.props.routes[index]),
						 }
					 });
				 }
				 }>
				<span>Route {index}</span>
			</div>
		));

		return (

			<div className="pt-1 pb-1 item">
				<div className="d-flex justify-content-between">
					<div className="pl-2 d-flex justify-content-center align-items-center">
						<img src={fileIcon} alt="File Icon"/>
					</div>


					<div
						className={"pl-2 pr-2 filename " + (this.props.routesEqualToStore ? 'opacity-1' : '')}
						onClick={() => {
							if (this.props.routesEqualToStore) {
								this.props.client.writeData({
									data: {
										instrumentActionRoutes: [],
										selectedRoute: [],
										visibleInstruments: []
									}
								});
							} else {
								this.props.client.writeData({
									data: {
										instrumentActionRoutes: this.props.routes,
										selectedRoute: [],
										visibleInstruments: [[this.props.name, this.props.instrumentLocation]]
									}
								});
							}
						}}>
						<span>{this.props.name}</span>
					</div>


					<div
						className="w-25 d-flex align-items-center">
						<img
							src={editIcon}
							alt="Edit Icon"
							className="edit-icon"
							onClick={() => this.props.editInstrumentAction(this.props.id)}
						/>
						<img src={deleteIcon} alt="Delete Icon" className="ml-2 edit-icon" onClick={() => this.setState({openModal: true})}/>
						<Mutation mutation={DELETE_INSTRUMENT_ACTION}>
							{(deleteInstrumentAction) => (
								<DeleteModal show={this.state.openModal}
											 onHide={() => this.setState({openModal: false})}
											 name={this.props.name}
											 canBeDeleted={true}
											 deleteItem={() => {
												 this.props.client.writeData({
													 data: {
														 instrumentActionRoutes: [],
														 selectedRoute: []
													 }
												 });
												 deleteInstrumentAction({
													 variables: {id: this.props.id},
													 refetchQueries: [{query: READ_FOLDERS}, {query: GET_WORKSPACE_DATA}]
												 });
											 }}/>
							)}
						</Mutation>
					</div>
				</div>
				{this.props.routesEqualToStore &&
				routes
				}
			</div>

		);
	}
}

export default InstrumentAction;

