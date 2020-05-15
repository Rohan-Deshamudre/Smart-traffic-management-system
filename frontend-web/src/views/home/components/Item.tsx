import * as React from 'react';
import '../styles/folder.scss';
import '../styles/scenarioItem.scss';

import { Mutation, ApolloConsumer, Query } from 'react-apollo';

// @ts-ignore
import fileIcon from "./../../../assets/document.svg";
// @ts-ignore
import editIcon from "./../../../assets/edit.svg";
// @ts-ignore
import playIcon from "./../../../assets/play-button.svg";
// @ts-ignore
import binIcon from "./../../../assets/bin.svg";
import { DELETE_FILE, READ_FOLDERS, UPDATE_FILE } from "../../../components/CRUDFolders";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import DeleteModal from "../../../components/other/DeleteModal";
import Label from '../../../components/other/ScenarioLabel';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Auth } from '../../../helper/auth';


function parseFromBackendLabels(labels): Label[] {
	return labels.map(t => {
		return { id: t.label, text: t.label, description: t.description }
	})
}
function parseToBackendLabels(labels: Label[]) {
	const a = labels.map(t => {
		return { label: t.text }
	});
	return a
}

type Props = {
	name: string,
	id: number,
	className: string,
	folders: any,
	folderId: number,
	labels: any[],
	description: string,
}

type SWFState = {
	editMode: boolean,
	name: string,
	folderId: number,
	openModal: boolean
	labels: Label[],
}

class Item extends React.Component<Props, SWFState> {
	constructor(props: Props) {
		super(props);
		this.state = {
			editMode: false,
			name: this.props.name,
			folderId: this.props.folderId,
			openModal: false,
			labels: parseFromBackendLabels(this.props.labels)
		}
	}

	render() {

		const folders = this.props.folders.map((folder: any) =>
			<li onClick={() => this.setState({ folderId: folder.id })} key={folder.id}
				className={this.state.folderId === folder.id ? 'active' : ''}>{folder.name}</li>
		);
		const labels = this.props.labels.map((label: any) =>
			<li key={label.id}> {label.label}</li>
		);

		const item = <div className={"pt-1 pb-1 scenario " + this.props.className}>
			{this.state.editMode ?

				<Mutation mutation={UPDATE_FILE}>
					{(updateFile) => (
						<div className="form">
							<div className="d-flex justify-content-between">
								<input
									value={this.state.name}
									onChange={(e) => this.setState({ name: e.target.value })}
								/>
								<span className="span-button"
									onClick={() => this.setState({ editMode: false })}>X</span>
							</div>
							<div>
								<span>Move to folder</span>
								<ul>
									{folders}
								</ul>

								<span>Labels</span>
								<ul>
									{labels}
								</ul>
							</div>
							<Button onClick={() => {
								updateFile({
									variables: {
										newID: this.props.id,
										newName: this.state.name,
										folderId: this.state.folderId
									},
									refetchQueries: [{ query: READ_FOLDERS }]
								});
								this.setState({ editMode: false })
							}}>Update file</Button>
						</div>
					)}
				</Mutation>

				:

				<ApolloConsumer>
					{client => (
						<div className="d-flex">

							{Auth.isEngineer() ?
								<Link className="d-flex w-75" onClick={() => {
									client.writeData({ data: { currentTreeId: this.props.id } })
								}} to='/designer'>

									<div className="w-25 d-flex justify-content-end">
										<img src={fileIcon} alt="File Icon" />
									</div>
									<div className="w-75 pl-3 filename">
										<span>{this.props.name}</span>
									</div>

								</Link>
								:
								<div className="d-flex w-75">
									<div className="w-25 d-flex justify-content-end">
										<img src={fileIcon} alt="File Icon" />
									</div>
									<div className="w-75 pl-3 ">
										<span>{this.props.name}</span>
									</div>
								</div>
							}

							<div className="w-25 d-flex align-items-center justify-content-around">
								{Auth.isEngineer() ?
									<img src={editIcon} alt="Edit Icon" className="folder-edit-icon edit-icon"
										onClick={() => this.setState({ editMode: true })} />
									: null}
								<Link to='/simulator' onClick={() => {
									client.writeData({ data: { currentTreeId: this.props.id } })
								}}>
									<    img src={playIcon} alt="Play Icon"
										className="folder-edit-icon edit-icon ml-2" />
								</Link>
								{Auth.isEngineer() ?
									<img src={binIcon} alt="Bin Icon" className="folder-edit-icon edit-icon ml-2"
										onClick={() => this.setState({ openModal: true })} />
									: null}
								<Mutation mutation={DELETE_FILE}>
									{(deleteFile) => (
										<DeleteModal show={this.state.openModal}
											onHide={() => this.setState({ openModal: false })}
											name={this.props.name}
											canBeDeleted={true}
											deleteItem={() => {
												this.setState({ openModal: false });
												deleteFile({
													variables: { id: this.props.id },
													refetchQueries: [{ query: READ_FOLDERS }]
												});
											}} />
									)}
								</Mutation>
							</div>
						</div>
					)}
				</ApolloConsumer>
			}
		</div>

		const description = this.props.description;

		return (
			(description !== null && description !== undefined && description.length > 0 ?
				<OverlayTrigger placement='auto' delay={{ show: 1000, hide: 0 }}
					overlay={<Tooltip id='tooltip'>{description}</Tooltip>}>
					{item}
				</OverlayTrigger> :
				item
			)
		);
	}
}

export default Item;
