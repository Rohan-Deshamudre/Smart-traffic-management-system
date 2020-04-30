import gql from "graphql-tag";

export const CREATE_FOLDER = gql`
    mutation createFolder($name: String!, $folderTypeId: Int!, $description: String, $parentId: Int) {
        createFolder(name: $name, folderTypeId: $folderTypeId, description: $description, parentId: $parentId) {
            name
            folderTypeId
            description
			parentId
        }
    }
`;

export const CREATE_FILE = gql`
    mutation createScenario($name: String!, $labels: [LabelInputObject]) {
        createScenario(name: $name, labels: $labels) {
            name
        }
    }
`;

export const CREATE_INSTRUMENT = gql`
    mutation createInstrument($name: String!, $instrumentTypeId: Int!, $lng: Float!, $lat: Float!, $instrumentSystemId: Int!, $description: String) {
        createInstrument(name: $name, instrumentTypeId: $instrumentTypeId, lng: $lng, lat: $lat, instrumentSystemId: $instrumentSystemId, description: $description) {
            name
            instrumentTypeId
            lng
            lat
            instrumentSystemId
            description
        }
    }
`;

export const CREATE_INSTRUMENT_ACTION = gql`
    mutation createInstrumentAction($instrumentId: Int!, $description: String, $text: String!, $routes: [[RoutePoint]]) {
        createInstrumentAction(instrumentId: $instrumentId, description: $description, text: $text, routes: $routes) {
            instrumentId
            description
			text
        }
    }
`;

export const READ_FOLDERS = gql`
    query ReadFolders($scenarioId: Int) {
        currDripId @client
        currentTreeId @client @export(as: "scenarioId")
        boundingBox @client
            
        folders {
            id
            name
            folderType {
                id
            }
            description
            scenarios {
                id
                name
                startLat
                startLng
                endLat
                endLng
                description
                labels {
                    id
                    label
                    description
                }
            }
        }
        
        scenarios {
            id
            name
            startLat
            startLng
            endLat
            endLng
            folder {
                id
            }
            description
            labels {
                id
                label
                description
            }
        }
        
        instruments(scenarioId: $scenarioId) {
            instrumentType {
                id
                name
            }
            id
            name
            lat
            lng
            description
            instrumentActions { 
                id
                text
                description
				routes {
					routePoints {
						lng
						lat
					}
				}
            }
        }

        instrumentTypes {
            id
            name
        }    
    }
`;



export const UPDATE_FOLDERS = gql`
    mutation UpdateFolder($newID: Int!, $newName: String) {
        updateFolder(id: $newID, name: $newName) {
            name
        }
    }
`;

export const UPDATE_FILE = gql`
    mutation UpdateFile($newID: Int!, $newName: String, $folderId: Int) {
        updateScenario(id: $newID, name: $newName, folderId: $folderId) {
            name
            folderId
        }
    }
`;

export const UPDATE_INSTRUMENT = gql`
    mutation UpdateInstrument($newID: Int!, $newName: String) {
        updateInstrument(id: $newID, name: $newName) {
            name
        }
    }
`;

export const UPDATE_INSTRUMENT_ACTION = gql`
    mutation UpdateInstrumentAction($newId: Int!, $text: String, $description: String, $routes: [[RoutePoint]]) {
        updateInstrumentAction(id: $newId, text: $text, description: $description, routes: $routes) {
			id
        }
    }
`;

export const DELETE_FOLDER = gql`
	mutation DeleteFolder($id: Int!) {
		deleteFolder(id: $id) {
			id
		}
	}	
`;

export const DELETE_FILE = gql`
    mutation DeleteScenario($id: Int!) {
        deleteScenario(id: $id) {
            id
        }
    }
`;

export const DELETE_INSTRUMENT = gql`
    mutation DeleteInstrument($id: Int!) {
        deleteInstrument(id: $id) {
            id
        }
    }
    `;

export const DELETE_INSTRUMENT_ACTION = gql`
    mutation DeleteInstrumentAction($id: Int!) {
        deleteInstrumentAction(id: $id) {
            id
        }
    }
`;