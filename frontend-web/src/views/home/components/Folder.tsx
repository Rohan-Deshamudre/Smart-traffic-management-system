import * as React from 'react';
import { useState } from 'react';
import '../styles/folder.scss';

// @ts-ignore
import rightArrowIcon from "./../../../assets/right-arrow.svg";
// @ts-ignore
import alertIcon from "./../../../assets/alert.svg";
// @ts-ignore
import folderIcon from "./../../../assets/folder.svg";
// @ts-ignore
import editIcon from "./../../../assets/edit.svg";
// @ts-ignore
import binIcon from "./../../../assets/bin.svg";
import { UPDATE_FOLDERS, READ_FOLDERS, DELETE_FOLDER } from "../../../components/CRUDFolders";
import { Mutation } from 'react-apollo';
import Button from "react-bootstrap/Button";
import Item from "./Item";
import DeleteModal from '../../../components/other/DeleteModal';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { mapHelper } from "../../../helper/map/mapHelper";
import { Auth } from '../../../helper/auth';

type FolderProps = {
    folder: any,
    folders: any,
    boundingBox: [[number, number], [number, number]],
    geoFilter: boolean
}

export default function Folder(props: FolderProps) {
    const [showItems, setShowItems] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState(props.folder.name);
    const [openModal, setOpenModal] = useState(false);

    function toggleFolder() {
        setShowItems(!showItems);
    }

    let hasOneActiveResponsePlan = false;
    const list = props.folder.scenarios
        .filter((item) => {
            if (props.geoFilter) {
                if (item.startLng === 0 || props.boundingBox.length > 0 && mapHelper.isWithinBoundingBox([[item.startLng, item.startLat], [item.endLng, item.endLat]], props.boundingBox)) {
                    return item
                }
            } else {
                return item
            }
        })
        .map((item) => { hasOneActiveResponsePlan = hasOneActiveResponsePlan || item.responsePlanActive; return item; })
        .map((item) => <div className="d-flex justify-content-end" key={item.id}>
            <Item name={item.name} id={item.id} description={item.description} folderId={props.folder.id}
                folders={props.folders} labels={item.labels} responsePlanActive={item.responsePlanActive}
                insights={JSON.parse(item.insights)}
                className="item" />
        </div>
        );

    const items =
        <div className="d-flex pt-1 pb-1 align-items-center folder-title" onClick={toggleFolder}>
            <div className="pl-3 pr-3 w-25 d-flex justify-content-between align-items-center">
                <img src={rightArrowIcon} alt="Right Arrow Icon"
                    className={'mr-2 ' + (list.length > 0 ? '' : 'hidden ') + (showItems ? 'open ' : '')} />
                <img src={hasOneActiveResponsePlan ? alertIcon : folderIcon} alt="Folder Icon" />
            </div>
            {editMode ?
                <Mutation mutation={UPDATE_FOLDERS}>
                    {(updateFolder) => (
                        <input
                            className="w-50"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    updateFolder({
                                        variables: {
                                            newID: parseInt(props.folder.id),
                                            newName: text
                                        },
                                        refetchQueries: [{ query: READ_FOLDERS }]
                                    });
                                    setEditMode(false);
                                }
                            }}
                        />
                    )}
                </Mutation>
                :
                <span className="w-50">{text}</span>
            }
            <div className="w-25 d-flex justify-content-around pl-2 pr-2">
                {Auth.isEngineer() ?
                    <img src={editIcon} alt="Edit Icon" className="folder-edit-icon"
                        onClick={() => setEditMode(!editMode)} />
                    : null}
                {Auth.isEngineer() ?
                    <img src={binIcon} alt="Bin Icon" className="folder-edit-icon"
                        onClick={() => setOpenModal(true)} />
                    : null}
                <Mutation mutation={DELETE_FOLDER}>
                    {(deleteFolder) => (
                        <DeleteModal show={openModal}
                            onHide={() => setOpenModal(false)}
                            name={text}
                            canBeDeleted={props.folder.scenarios.length === 0}
                            deleteItem={() => {
                                deleteFolder({
                                    variables: { id: parseInt(props.folder.id) },
                                    refetchQueries: [{ query: READ_FOLDERS }]
                                });
                            }} />
                    )}
                </Mutation>
            </div>
        </div>;

    const description = props.folder.description;

    return (
        (description !== null && description !== undefined && description.length > 0 ?
            <div className="folder">
                <OverlayTrigger placement='auto' delay={{ show: 1000, hide: 0 }}
                    overlay={<Tooltip id='tooltip'>{description}</Tooltip>}>
                    {items}
                </OverlayTrigger>
                {showItems ? list : null}
            </div>
            :
            <div className="folder">
                {items}
                {showItems ? list : null}
            </div>
        )
    );
}
