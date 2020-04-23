import * as React from 'react';
import Button from "react-bootstrap/Button";
import axios from 'axios'
import Modal from "react-bootstrap/esm/Modal";
import List from "react-list-select"
import '../../styles/exportInstrument.scss';
// @ts-ignore
import downloadIcon from "./../../../../assets/home_left_pane/download.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";


type Props = {
	client: any,
	instruments: any
}

type State = {
	selectedFile: any,
	editMode: boolean,
	warningText: string
}

class ExportInstruments extends React.Component<Props, State, {}> {

	constructor(props: Props) {
		super(props);
		this.state = {
			selectedFile: null,
			editMode: false,
			warningText: "",
		}

		this.onChangeHandler = this.onChangeHandler.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	onChangeHandler = (event) => {
		this.setState({
			selectedFile: event.target.files[0]
		});
	}

	handleSubmit = (instruments) => {
		if (instruments.length > 0) {
			axios.post(process.env.INSTRUMENT_EXPORT, instruments)
				.then(res => {
					const blob = new Blob([res.data], {type: "text/csv;charset=utf-8"});
					const url = URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.download = 'test.csv';
					link.href = url;
					link.click();
				})
				.catch(error => {
					this.setState({warningText: "Incorrecte ID(s)"})
				});
		} else {
			this.setState({warningText: "Geen instrument(s) geselecteerd!"})
		}

	}

	render() {
		let instruments = [];
		const warningText = this.state.warningText;
		return (
			<div>
				<Modal
					show={this.state.editMode}
					onHide={() => (this.setState({editMode: false, warningText: ""}))}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Export instruments
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<List
							items={this.props.instruments.map(x => x.name)}
							multiple={true}
							selected={0}
							onChange={(selected: [number]) => {instruments = selected;}}
						/>
					</Modal.Body>
					<Modal.Footer>
						<p className="mr-auto">{warningText}</p>
						<Button variant="secondary" onClick={() => this.setState({editMode: false})}>Close</Button>
						<Button variant="primary" onClick={() => {
							this.handleSubmit(instruments.map(x => parseInt(this.props.instruments[x].id)))
						}} className="remove-borders">
							Export
						</Button>
					</Modal.Footer>

				</Modal>
          <OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Download instrument(s)</Tooltip>}>
            <Button className="remove-border-left " onClick={() => this.setState({editMode: true, warningText: ""} )}>
              <img src={downloadIcon} alt="download"/>
            </Button>
          </OverlayTrigger>
			</div>
		);


	}
}

export default ExportInstruments;
