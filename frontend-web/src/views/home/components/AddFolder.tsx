import * as React from 'react';
import { useState } from 'react';
import '../styles/folder.scss';

// @ts-ignore
import createFolderIcon from "./../../../assets/home_left_pane/create_folder.svg";

import { CREATE_FOLDER, READ_FOLDERS } from "../../../components/CRUDFolders";
import { Mutation } from 'react-apollo';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/esm/Modal";
import Name from "../../../components/other/Name";
import Description from "../../../components/other/Description";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

type Props = {
    parentId: number
}

export default function AddFolder(props: Props) {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div>
            <Mutation mutation={CREATE_FOLDER}>
                {(createFolder, { data }) => (
                    <Modal
                        show={editMode}
                        onHide={() => setEditMode(false)}
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
                            <Name handleName={(newName: string) => setName(newName)} />
                            <Description handleDescription={(newDescr: string) => setDescription(newDescr)} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary"
                                onClick={() => setEditMode(false)}>Close</Button>
                            <Button variant="primary" disabled={name === ""} onClick={() => {
                                createFolder({
                                    variables: {
                                        name: name,
                                        folderTypeId: 1,
                                        description: description,
                                        parentId: props.parentId === null ? undefined : props.parentId
                                    },
                                    refetchQueries: [{ query: READ_FOLDERS }]
                                });
                                setEditMode(false);
                                setName("");
                                setDescription("");
                            }}>Create</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </Mutation>
            <OverlayTrigger key='top' overlay={<Tooltip id='tooltip-top'>Creëer folder</Tooltip>}>
                <Button className="button" onClick={() => setEditMode(true)}>
                    <img src={createFolderIcon} alt="Create Folder" />
                </Button>
            </OverlayTrigger>
        </div>
    );
}
