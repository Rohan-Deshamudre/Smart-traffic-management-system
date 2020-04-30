import * as React from 'react';
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";

type Props = {
	show: boolean,
	onHide: () => void,
	deleteItem: () => void,
	name: string,
	canBeDeleted: boolean
}

class DeleteModal extends React.Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	render() {
		const text = this.props.canBeDeleted ? 'You are about to delete ' + this.props.name + '. Are you sure you want to delete it?' : 'You first need to delete the children items of this parent item';
		return (
			<Modal
				show={this.props.show}
				onHide={this.props.onHide}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Warning
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						{text}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={this.props.onHide}>Close</Button>
					{this.props.canBeDeleted && <Button variant="primary" onClick={this.props.deleteItem}>Delete</Button>}
				</Modal.Footer>
			</Modal>
		);
	}
}


export default DeleteModal;
