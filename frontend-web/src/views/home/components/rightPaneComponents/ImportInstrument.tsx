import * as React from 'react';
import Button from "react-bootstrap/Button";
import axios from 'axios'
import Modal from "react-bootstrap/esm/Modal";
// @ts-ignore
import uploadIcon from "./../../../../assets/home_left_pane/upload.svg";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";



type Props = {
	client: any
}

type State = {
	selectedFile: any,
	editMode: boolean,
	warningText: string
}

class ImportInstruments extends React.Component<Props, State, {}> {

	constructor(props: Props) {
		super(props);
		this.state = {
			selectedFile: null,
			editMode: false,
			warningText: ""
		}

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.handleFile = this.handleFile.bind(this);
	}

	onChangeHandler = (event) => {
		this.setState({
			selectedFile: event.target.files[0]
		});
	}

	handleFile = () => {
		if (this.state.selectedFile != null) {
			let file = this.state.selectedFile;
			if (file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
				axios.post(process.env.INSTRUMENT_IMPORT, file)
					.then(res => {
						this.setState({selectedFile: null, editMode: false});
						this.props.client.queryManager.reFetchObservableQueries()
					})
					.catch(error => {
						this.setState({warningText: "Het bestand bevat een incorrecte CSV format!"})
					});
			} else {
				this.setState({warningText: "Het geselecteerde bestand is geen CSV!"})
			}
		} else {
			this.setState({warningText: "Geen bestand geselecteerd!"})
		}

	}

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
							Upload nieuwe instrument(s):
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>Selecteer een CSV bestand</p>
						<div>
							<input type="file" name="file" accept=".csv" onChange={this.onChangeHandler} />
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
				<OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Upload instrument(s)</Tooltip>}>
					<Button className="remove-borders" onClick={() => this.setState({editMode: true})}>
						<img src={uploadIcon} alt="Upload"/>
					</Button>
				</OverlayTrigger>
			</div>
		);


	}
}

export default ImportInstruments;
