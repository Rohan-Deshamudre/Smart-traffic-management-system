import * as React from 'react';
import '../styles/folder.scss';

// @ts-ignore
import createScenarioIcon from "./../../../assets/home_left_pane/create_file.svg";

import {CREATE_FILE, READ_FOLDERS} from "../../../components/CRUDFolders";
import {Mutation, Query} from 'react-apollo';
import Button from "react-bootstrap/Button";
import { WithContext as ReactTags } from 'react-tag-input';

import Modal from 'react-bootstrap/esm/Modal';
import Description from "../../../components/other/Description";
import Name from "../../../components/other/Name";
import Label from '../../../components/other/ScenarioLabel';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

type State = {
	editMode: boolean,
	name: string,
	description: string,
	labels: Label[],
	scenario_labels: Label[],
}

type Props = {
	labels: any[]
}

function parseFromBackendLabels(labels) : Label[]{
	return labels.map(t=> {
		return {id:t.label, text:t.label, description:t.description}
		 })
}
function parseToBackendLabels(labels: Label[]){
	return labels.map(t=> {
		return {label:t.text}
		 })
}


class AddScenario extends React.Component<Props, State> {
	baseState = {
		editMode: false,
		name: '',
		description: '',
		labels: parseFromBackendLabels(this.props.labels),
		scenario_labels: []

	};

	constructor(props: Props) {
		super(props);
		this.state = this.baseState;

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);

	}


    handleAddition(inputLabel) {
		const { scenario_labels } = this.state;
		const matched = scenario_labels.filter(label => label.text ==inputLabel.text)
		if(matched.length == 0)
			this.setState({ scenario_labels: [...this.state.scenario_labels, inputLabel] });
	}


    handleDelete(i) {
        const { scenario_labels } = this.state;
        this.setState({
			scenario_labels: scenario_labels.filter((tag, index) => index !== i),
        });
	}

	render() {
		return (
			<div>
				<Mutation mutation={CREATE_FILE}>
					{(createScenario) => (
						<Modal
							show={this.state.editMode}
							onHide={() => this.setState({editMode: false})}
							size="lg"
							aria-labelledby="contained-modal-title-vcenter"
							centered
						>
							<Modal.Header closeButton>
								<Modal.Title id="contained-modal-title-vcenter">
									Voeg nieuwe scenario toe:
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Name handleName={(newName: string) => this.setState({name: newName})}/>
								<Description handleDescription={(newDescr: string) => this.setState({description: newDescr})} />
							</Modal.Body>
							<Modal.Footer>


							<ReactTags tags={this.state.scenario_labels}
									suggestions={this.state.labels}
									handleDelete={this.handleDelete}
									handleAddition={this.handleAddition}
									allowDragDrop={false}
									autocomplete={true}
									/>
								<Button variant="secondary"
										onClick={() => this.setState({editMode: false})}>Close</Button>
								<Button variant="primary"
										disabled={this.state.name === ''}
										onClick={() => {
									createScenario({
										variables: {
											name: this.state.name,
											description: this.state.description,
											labels: parseToBackendLabels(this.state.scenario_labels)
										},
										refetchQueries: [{query: READ_FOLDERS}]
									});
									this.setState(this.baseState);
								}}>Create</Button>
							</Modal.Footer>
						</Modal>
					)}
				</Mutation>

				<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Creëer scenario</Tooltip>}>
					<Button className="remove-borders" onClick={() => this.setState({editMode: true})}>
						<img src={createScenarioIcon} alt="Create Scenario"/>
					</Button>
				</OverlayTrigger>
			</div>
		);
	}
}

export default AddScenario;
