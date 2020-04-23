import * as React from "react";

import {CREATE_INSTRUMENT, READ_FOLDERS} from "../../../../components/CRUDFolders";
import {GET_INSTRUMENT_SYSTEM_TYPES} from "../../../scenario-designer/toolboxes/road-condition-action/RoadConditionActionToolboxQueries";
import Name from "../../../../components/other/Name";
import LocationSelector from "../../../../components/map/LocationSelector";
import Type from "../../../../components/other/Type";
import {Query, Mutation} from "react-apollo";
import Description from "../../../../components/other/Description";
import Button from "react-bootstrap/Button";

// @ts-ignore
import addIcon from "../../../../assets/add-button.svg";

import '../../styles/instrument.scss';
import Modal from "react-bootstrap/esm/Modal";
import gql from "graphql-tag";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type Props = {
	instrumentTypeId: string,
	instrumentTypeName: string,
	pointerLng: number,
	pointerLat: number,
}

type State = {
	name: string,
	lng: number,
	lat: number,
	instrumentSystemId: number,
	description: string,
	editMode: boolean
}

class CreateInstrument extends React.Component<Props, State> {
	baseState = {
		name: '',
		lng: this.props.pointerLng,
		lat: this.props.pointerLat,
		instrumentSystemId: 1,
		description: '',
		editMode: false
	};

	constructor(props: Props) {
		super(props);
		this.state = this.baseState;
	}

	filled() {
		return this.state.name !== '' && this.state.lng !== 0 && this.state.lat !== 0 && this.state.description !== ''
	}

	render() {
		return (
			<div>
				{ (this.props.pointerLng === 0 || this.props.pointerLat === 0) ?
					<Modal
						show={this.state.editMode}
						onHide={() => this.setState({editMode: false})}
						size="lg"
						aria-labelledby="contained-modal-title-vcenter"
						centered
					>
						<Modal.Header closeButton>
							<Modal.Title id="contained-modal-title-vcenter">
								Let op!
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Klik eerst op de kaart om een locatie te kiezen voor uw instrument.
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={() => this.setState({editMode: false})}>Close</Button>
						</Modal.Footer>
					</Modal>
				:
					<Mutation mutation={CREATE_INSTRUMENT}>
						{(createInstrument) => (

							<Modal
								show={this.state.editMode}
								onHide={() => this.setState({editMode: false})}
								size="lg"
								aria-labelledby="contained-modal-title-vcenter"
								centered
							>
								<Modal.Header closeButton>
									<Modal.Title id="contained-modal-title-vcenter">
										Voeg nieuwe {this.props.instrumentTypeName} toe:
									</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<div className="container">
										<div className="row">
											<div className="col-6">
												<Name
													handleName={(newName: string) => this.setState({name: newName})}
												/>
												<LocationSelector handleLocation={(loc: [number, number]) => this.setState({lng: loc[0], lat: loc[1]})}/>
											</div>
											<div className="col-6">
												<Query query={GET_INSTRUMENT_SYSTEM_TYPES}>
													{({data, loading, error}) => {
														if (loading) return <p>Loading</p>;
														if (error) return <p>Error</p>;
														return (
															<Type selectedId={this.state.instrumentSystemId}
																  types={data.instrumentSystems}
																  handleType={(newId: number) => this.setState({instrumentSystemId: newId})}/>
														);
													}}
												</Query>

												<Description handleDescription={(newDescription: string) => this.setState({description: newDescription})}/>
											</div>
										</div>
									</div>
								</Modal.Body>
								<Modal.Footer>
									<Button variant="secondary" onClick={() => this.setState({editMode: false})}>Close</Button>
									<Button variant="primary" disabled={!this.filled()}
											onClick={() => {
												createInstrument({
													variables: {
														name: this.state.name,
														instrumentTypeId: parseInt(this.props.instrumentTypeId),
														lng: this.state.lng,
														lat: this.state.lat,
														instrumentSystemId: this.state.instrumentSystemId,
														description: this.state.description
													},
													refetchQueries: [{query: READ_FOLDERS}]
												});
												this.setState(this.baseState);
											}}>Creëer {this.props.instrumentTypeName}</Button>
								</Modal.Footer>
							</Modal>
						)}
					</Mutation>
				}

				<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Creëer instrument</Tooltip>}>
					<Button className="button" onClick={() => this.setState({editMode: true})}>
						<img src={addIcon} alt="Add Icon"/>
					</Button>
				</OverlayTrigger>
			</div>
		)
	}
}

export default CreateInstrument;
