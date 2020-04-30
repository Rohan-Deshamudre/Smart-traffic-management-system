import * as React from 'react';
import '../styles/folder.scss';

// @ts-ignore
import rightArrowIcon from "./../../../assets/right-arrow.svg";
// @ts-ignore
import folderIcon from "./../../../assets/folder.svg";
// @ts-ignore
import editIcon from "./../../../assets/edit.svg";
// @ts-ignore
import binIcon from "./../../../assets/bin.svg";
import {UPDATE_FOLDERS, READ_FOLDERS, DELETE_FOLDER} from "../../../components/CRUDFolders";
import {Mutation} from 'react-apollo';
import Button from "react-bootstrap/Button";
import Item from "./Item";
import DeleteModal from '../../../components/other/DeleteModal';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {mapHelper} from "../../../helper/map/mapHelper";

type FolderProps = {
	folder: any,
	folders: any,
	boundingBox: [[number, number], [number, number]],
	geoFilter: boolean
}

type FolderState = {
	showItems: boolean,
	editMode: boolean,
	text: string,
	openModal: boolean
}

class Folder extends React.Component<FolderProps, FolderState> {
	constructor(FolderProps: FolderProps) {
		super(FolderProps);
		this.state = {
			showItems: false,
			editMode: false,
			text: this.props.folder.name,
			openModal: false
		};
		this.toggleFolder = this.toggleFolder.bind(this);
	}

	toggleFolder() {
		this.setState((state) => ({
			showItems: !state.showItems
		}));
	}

	render() {
		const list = this.props.folder.scenarios
			.filter((item) => {
				if (this.props.geoFilter) {
					if (item.startLng === 0 || this.props.boundingBox.length > 0 && mapHelper.isWithinBoundingBox([[item.startLng, item.startLat], [item.endLng, item.endLat]], this.props.boundingBox)) {
						return item
					}
				} else {
					return item
				}
			})
			.map((item) => <div className="d-flex justify-content-end" key={item.id}>
					<Item name={item.name} id={item.id} description={item.description} folderId={this.props.folder.id}
						  folders={this.props.folders} labels={item.labels}
						  className="item"/>
				</div>
			);

		const items =
			<div className="d-flex pt-1 pb-1 align-items-center folder-title" onClick={this.toggleFolder}>
				<div className="pl-3 pr-3 w-25 d-flex justify-content-between align-items-center">
					<img src={rightArrowIcon} alt="Right Arrow Icon"
						 className={'mr-2 ' + (list.length > 0 ? '' : 'hidden ') + (this.state.showItems ? 'open ' : '')}/>
					<img src={folderIcon} alt="Folder Icon"/>
				</div>
				{this.state.editMode ?
					<Mutation mutation={UPDATE_FOLDERS}>
						{(updateFolder) => (
							<input
								className="w-50"
								value={this.state.text}
								onChange={(e) => this.setState({text: e.target.value})}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										updateFolder({
											variables: {
												newID: parseInt(this.props.folder.id),
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
					<span className="w-50">{this.state.text}</span>
				}
				<div className="w-25 d-flex justify-content-around pl-2 pr-2">
					<img src={editIcon} alt="Edit Icon" className="folder-edit-icon"
						 onClick={() => this.setState({editMode: !this.state.editMode})}/>
					<img src={binIcon} alt="Bin Icon" className="folder-edit-icon"
						 onClick={() => this.setState({openModal: true})}/>
					<Mutation mutation={DELETE_FOLDER}>
						{(deleteFolder) => (
							<DeleteModal show={this.state.openModal}
										 onHide={() => this.setState({openModal: false})}
										 name={this.state.text}
										 canBeDeleted={this.props.folder.scenarios.length === 0}
										 deleteItem={() => {
											 deleteFolder({
												 variables: {id: parseInt(this.props.folder.id)},
												 refetchQueries: [{query: READ_FOLDERS}]
											 });
										 }}/>
						)}
					</Mutation>
				</div>
			</div>;

		const description = this.props.folder.description;

		return (
			(description !== null && description !== undefined && description.length > 0 ?
					<div className="folder">
						<OverlayTrigger placement='auto' delay={{show: 1000, hide: 0}}
										overlay={<Tooltip id='tooltip'>{description}</Tooltip>}>
							{items}
						</OverlayTrigger>
						{this.state.showItems ? list : null}
					</div>
					:
					<div className="folder">
						{items}
						{this.state.showItems ? list : null}
					</div>
			)
		);
	}
}

export default Folder;
