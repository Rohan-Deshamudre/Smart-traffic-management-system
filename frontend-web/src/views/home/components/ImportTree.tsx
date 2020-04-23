import * as React from 'react';
import Button from "react-bootstrap/Button";
import axios from 'axios'

// @ts-ignore
import uploadIcon from "./../../../assets/home_left_pane/upload.svg";
import {READ_FOLDERS} from "../../../components/CRUDFolders";
import Modal from 'react-bootstrap/esm/Modal';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";


type Props = {
	client: any
}

type State = {
	selectedFile: any,
	editMode: boolean,
	warningText: string,
}

class ImportTree extends React.Component<Props, State, {}> {

	constructor(props: Props) {
		super(props);
		this.state = {
			selectedFile: null,
			editMode: false,
			warningText: ""
		};

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.handleFile = this.handleFile.bind(this);
	}

	onChangeHandler = (event) => {
		this.setState({
			selectedFile: event.target.files[0]
		});
	};

	handleFile = () => {
		if (this.state.selectedFile != null) {
			if (this.state.selectedFile.type == "application/json") {
				axios.post(process.env.TREE_IMPORT, this.state.selectedFile)
					.then(res => {
						this.setState({selectedFile: null, editMode: false});
						this.props.client.queryManager.reFetchObservableQueries()
					})
					.catch(error => {
						this.setState({warningText: "Het bestand bevat een incorrecte JSON format!"})
					});
			} else {
				this.setState({warningText: "Het geselecteerd bestand is geen JSON!"})
			}
		} else {
			this.setState({warningText: "Geen bestand geselecteerd!"})
		}

	};

	render() {
		const warningText = this.state.warningText;
		return (
			<div>
				<Modal
					show={this.state.editMode}
					onHide={() => this.setState({editMode: false, warningText: ""})}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Upload nieuwe scenario:
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Selecteer een JSON bestand</p>
						<div>
							<input type="file" name="file" accept=".json" onChange={this.onChangeHandler}/>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<p className="mr-auto">{warningText}</p>
						<Button variant="secondary" onClick={() => this.setState({editMode: false, warningText: ""})}>Close</Button>
						<Button variant="primary" onClick={() => {
							this.handleFile();
						}}>Upload</Button>
					</Modal.Footer>
				</Modal>

				<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Upload scenario</Tooltip>}>
					<Button onClick={() => this.setState({editMode: true})}>
						<img src={uploadIcon} alt="Upload"/>
					</Button>
				</OverlayTrigger>
			</div>
		);


	}
}

export default ImportTree;
