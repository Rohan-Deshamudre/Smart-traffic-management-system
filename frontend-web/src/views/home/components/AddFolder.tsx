import * as React from 'react';
import '../styles/folder.scss';

// @ts-ignore
import createFolderIcon from "./../../../assets/home_left_pane/create_folder.svg";

import {CREATE_FOLDER, READ_FOLDERS} from "../../../components/CRUDFolders";
import {Mutation} from 'react-apollo';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/esm/Modal";
import Name from "../../../components/other/Name";
import Description from "../../../components/other/Description";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type Props = {
	parentId: number
}

type State = {
	editMode: boolean,
	name: string,
	description: string

}

class AddFolder extends React.Component<Props, State> {
	baseState = {
		editMode: false,
		name: '',
		description: ''

	};

	constructor(props: Props) {
		super(props);
		this.state = this.baseState;
	}

	render() {


		return (
			<div>
				<Mutation mutation={CREATE_FOLDER}>
					{(createFolder, {data}) => (
						<Modal
							show={this.state.editMode}
							onHide={() => this.setState({editMode: false})}
							size="lg"
							aria-labelledby="contained-modal-title-vcenter"
							centered
						>
							<Modal.Header closeButton>
								<Modal.Title id="contained-modal-title-vcenter">
									Voeg nieuwe folder toe:
								</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Name handleName={(newName: string) => this.setState({name: newName})}/>
								<Description handleDescription={(newDescr: string) => this.setState({description: newDescr})} />
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary"
										onClick={() => this.setState({editMode: false})}>Close</Button>
								<Button variant="primary" disabled={this.state.name === ''} onClick={() => {
									createFolder({
										variables: {
											name: this.state.name,
											folderTypeId: 1,
											description: this.state.description,
											parentId: this.props.parentId === null ? undefined : this.props.parentId
										},
										refetchQueries: [{query: READ_FOLDERS}]
									});
									this.setState(this.baseState);
								}}>Create</Button>
							</Modal.Footer>
						</Modal>
					)}
				</Mutation>
				<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Creëer folder</Tooltip>}>
					<Button className="button" onClick={() => this.setState({editMode: true})}>
						<img src={createFolderIcon} alt="Create Folder"/>
					</Button>
				</OverlayTrigger>
			</div>
		);
	}
}

export default AddFolder;
