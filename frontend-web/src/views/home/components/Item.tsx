import * as React from 'react';
import { useState } from 'react';
import '../styles/folder.scss';
import '../styles/scenarioItem.scss';

import { Mutation, ApolloConsumer, Query } from 'react-apollo';

// @ts-ignore
import fileIcon from "./../../../assets/document.svg";
// @ts-ignore
import activeIcon from "./../../../assets/active.svg";
// @ts-ignore
import notActiveIcon from "./../../../assets/not_active.svg";
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
    responsePlanActive: boolean
}

export default function Item(props: Props) {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(props.name);
    const [folderId, setFolderId] = useState(props.folderId);
    const [openModal, setOpenModal] = useState(false);

    const folders = props.folders.map((folder: any) =>
        <li onClick={() => setFolderId(folder.id)} key={folder.id}
            className={folderId === folder.id ? 'active' : ''}>{folder.name}</li>
    );
    const labels = props.labels.map((label: any) =>
        <li key={label.id}> {label.label}</li>
    );

    const item = <div className={"pt-1 pb-1 scenario " + props.className}>
        {editMode ?

            <Mutation mutation={UPDATE_FILE}>
                {(updateFile) => (
                    <div className="form">
                        <div className="d-flex justify-content-between">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <span className="span-button"
                                onClick={() => setEditMode(false)}>X</span>
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
                                    newID: props.id,
                                    newName: name,
                                    folderId: folderId
                                },
                                refetchQueries: [{ query: READ_FOLDERS }]
                            });
                            setEditMode(false)
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
                                client.writeData({ data: { currentTreeId: props.id } })
                            }} to='/designer'>

                                <div className="w-25 d-flex justify-content-end">
                                    <img src={props.responsePlanActive ? activeIcon : notActiveIcon} alt="Response Plan Icon" />
                                </div>

                                <div className="w-25 d-flex justify-content-end">
                                    <img src={fileIcon} alt="File Icon" />
                                </div>
                                <div className="w-75 pl-3 filename">
                                    <span>{props.name}</span>
                                </div>

                            </Link>
                            :
                            <div className="d-flex w-75">
                                <div className="w-25 d-flex justify-content-end">
                                    <img src={props.responsePlanActive ? activeIcon : notActiveIcon} alt="Response Plan Icon" />
                                </div>

                                <div className="w-25 d-flex justify-content-end">
                                    <img src={fileIcon} alt="File Icon" />
                                </div>
                                <div className="w-75 pl-3 ">
                                    <span>{props.name}</span>
                                </div>
                            </div>
                        }

                        <div className="w-25 d-flex align-items-center justify-content-around">
                            {Auth.isEngineer() ?
                                <img src={editIcon} alt="Edit Icon" className="folder-edit-icon edit-icon"
                                    onClick={() => setEditMode(true)} />
                                : null}
                            <Link to='/simulator' onClick={() => {
                                client.writeData({ data: { currentTreeId: props.id } })
                            }}>
                                <    img src={playIcon} alt="Play Icon"
                                    className="folder-edit-icon edit-icon ml-2" />
                            </Link>
                            {Auth.isEngineer() ?
                                <img src={binIcon} alt="Bin Icon" className="folder-edit-icon edit-icon ml-2"
                                    onClick={() => setOpenModal(true)} />
                                : null}
                            <Mutation mutation={DELETE_FILE}>
                                {(deleteFile) => (
                                    <DeleteModal show={openModal}
                                        onHide={() => setOpenModal(false)}
                                        name={props.name}
                                        canBeDeleted={true}
                                        deleteItem={() => {
                                            setOpenModal(false);
                                            deleteFile({
                                                variables: { id: props.id },
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

    const description = props.description;

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
