import * as React from 'react';
import '../../styles/instrument.scss';
import * as _ from 'lodash';

// @ts-ignore
import rightArrowIcon from "./../../../../assets/right-arrow.svg";
// @ts-ignore
import mtmIcon from "../../../../assets/instruments/mtm.svg";
// @ts-ignore
import overigIcon from "../../../../assets/instruments/overig.svg";
// @ts-ignore
import tdiIcon from "../../../../assets/instruments/tdi.svg";
// @ts-ignore
import tekstkarIcon from "../../../../assets/instruments/tekstkar.svg";
// @ts-ignore
import vrIcon from "../../../../assets/instruments/verkeersregelaar.svg";
// @ts-ignore
import vriIcon from "../../../../assets/instruments/vri.svg";
// @ts-ignore
import dripIcon from "../../../../assets/instruments/drip.svg";
// @ts-ignore
import editIcon from "./../../../../assets/edit.svg";
// @ts-ignore
import deleteIcon from "./../../../../assets/bin.svg";
import {
	READ_FOLDERS, DELETE_INSTRUMENT,
	UPDATE_INSTRUMENT
} from "../../../../components/CRUDFolders";
import {Mutation, Query, ApolloConsumer} from 'react-apollo';
import Button from "react-bootstrap/Button";
import InstrumentAction from "./InstrumentAction";
import MutateInstrumentAction from "./MutateInstrumentAction";
import gql from "graphql-tag";
import DeleteModal from "../../../../components/other/DeleteModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type Props = {
	instrument: any,
}

type State = {
	showItems: boolean,
	editMode: boolean,
	text: string,
	creatingInstrumentAction: boolean,
	editInstrumentAction: number,
	openModal: boolean
}

const GET_INSTRUMENT_ACTION_ROUTES_LOCAL = gql`
    query getInstrumentActionsRoutesLocal {
        instrumentActionRoutes @client
        selectedRoute @client
    }
`;


class Instrument extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			showItems: false,
			editMode: false,
			text: this.props.instrument.name,
			creatingInstrumentAction: false,
			editInstrumentAction: undefined,
			openModal: false
		};
		this.toggleInstrument = this.toggleInstrument.bind(this);
		this.handleEditAction = this.handleEditAction.bind(this);
		this.getIcon = this.getIcon.bind(this);
	}

	toggleInstrument() {
		this.setState((state) => ({
			showItems: !state.showItems
		}));
	}

	handleEditAction(id: number) {
		this.setState({
			editInstrumentAction: id,
			creatingInstrumentAction: false
		})
	}

	getIcon() {
		switch (this.props.instrument.type) {
			case '1':
				return dripIcon;
			case '4':
				return vriIcon;
			case '5':
				return tdiIcon;
			case '6':
				return mtmIcon;
			case '7':
				return tekstkarIcon;
			case '8':
				return vrIcon;
			case '9':
				return overigIcon;
			default:
				return dripIcon;
		}
	}

	render() {

		const list = this.props.instrument.instrumentActions.map((item) => {
				return (<div className="d-flex justify-content-end" key={item.id}>
					{item.id === this.state.editInstrumentAction ?
						<MutateInstrumentAction
							handleInstrumentAction={() => this.setState({editInstrumentAction: undefined})}
							instrumentId={this.props.instrument.id}
							description={item.description}
							text={item.text}
							routes={item.routes.map(route => route.routePoints.map(routePoint => ({
								lng: routePoint.lng,
								lat: routePoint.lat
							})))}
							id={item.id}
							type={this.props.instrument.type}
						/>
						:
						<Query query={GET_INSTRUMENT_ACTION_ROUTES_LOCAL}>
							{({loading, error, data, client}) => {
								if (loading) return <div>Fetching</div>;
								if (error) return <div>Error</div>;

								const routes = item.routes.map(route => route.routePoints.map(routePoint => [routePoint.lng, routePoint.lat]));
								const routesEqualToStore = _.isEqual(routes, data.instrumentActionRoutes) && routes.length > 0;

								return (
									<InstrumentAction client={client}
													  editInstrumentAction={this.handleEditAction}
													  name={item.text}
													  id={item.id}
													  instrumentLocation={[this.props.instrument.lng, this.props.instrument.lat]}
													  routes={routes}
													  routesEqualToStore={routesEqualToStore}
													  selectedRouteInStore={data.selectedRoute}
									/>
								)
							}}
						</Query>
					}
				</div>)
			}
		);

		const item = <div className="instrument">

			<div className="d-flex pt-1 pb-1 instrument-title">

				<div className="pl-3 pr-3 w-25 d-flex justify-content-between align-items-center"
					 onClick={this.toggleInstrument}>
					<img src={rightArrowIcon} alt="Right Arrow Icon"
						 className={'mr-2 ' + (this.props.instrument.instrumentActions.length > 0 ? '' : 'hidden ') + (this.state.showItems ? 'open ' : '')}/>
					<img src={this.getIcon()} alt="Folder Icon"/>
				</div>

				{this.state.editMode ?

					<Mutation mutation={UPDATE_INSTRUMENT}>
						{(updateInstrument) => (
							<input
								value={this.state.text}
								onChange={(e) => this.setState({text: e.target.value})}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										updateInstrument({
											variables: {
												newID: parseInt(this.props.instrument.id),
												newName: this.state.text
											},
											refetchQueries: [{query: READ_FOLDERS}]
										});
										this.setState({editMode: false})
									}
								}}
							/>
						)}
					</Mutation>

					:

					<ApolloConsumer>
						{client => (
							<span className="w-50 d-flex align-items-center" onClick={() => {
								this.toggleInstrument();
								client.writeData({
									data: {
										visibleInstruments: []
									}
								})
							}}>{this.state.text}</span>
						)}
					</ApolloConsumer>

				}

				<div className="w-25 d-flex justify-content-end align-items-center pr-3 icons">

							<span className="folder-edit-icon" onClick={() => this.setState({
								creatingInstrumentAction: !this.state.creatingInstrumentAction,
								showItems: false,
								editInstrumentAction: undefined
							})}>{this.state.creatingInstrumentAction ? 'x' : '+'}</span>

					<img src={editIcon} alt="Edit Icon" className="ml-2 folder-edit-icon"
						 onClick={() => this.setState({editMode: !this.state.editMode})}/>

					<img src={deleteIcon} alt="Delete Icon" className="ml-2 folder-edit-icon"
						 onClick={() => this.setState({openModal: true})}/>
					<Mutation mutation={DELETE_INSTRUMENT}>
						{(deleteInstrument) => (
							<DeleteModal show={this.state.openModal}
										 onHide={() => this.setState({openModal: false})}
										 name={this.state.text}
										 canBeDeleted={this.props.instrument.instrumentActions.length === 0}
										 deleteItem={() => {
											 deleteInstrument({
												 variables: {id: parseInt(this.props.instrument.id)},
												 refetchQueries: [{query: READ_FOLDERS}]
											 });
										 }}/>
						)}
					</Mutation>

				</div>
			</div>


			{/* Showing the instrument actions */}
			{this.state.showItems ? list : null}

			{/* Showing the Create Instrument Action Form */}
			{
				this.state.creatingInstrumentAction ? <MutateInstrumentAction
					handleInstrumentAction={() => this.setState({creatingInstrumentAction: false})}
					instrumentId={this.props.instrument.id}
					type={this.props.instrument.type}/> : null
			}
		</div>

		const description = this.props.instrument.description;

		return (
			(description !== null && description !== undefined && description.length > 0 ?
					<OverlayTrigger placement='auto' delay={{show: 1000, hide: 0}}
									overlay={<Tooltip id='tooltip'>{description}</Tooltip>}>
						{item}
					</OverlayTrigger> :
					item
			)
		);
	}
}

export default Instrument;
