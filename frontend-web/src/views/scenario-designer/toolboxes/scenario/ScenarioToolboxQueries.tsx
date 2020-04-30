import gql from "graphql-tag";

export const UPDATE_SCENARIO = gql`
    mutation updateScenario ($id: Int!, $name: String, $folderId: Int, $description: String) {
        updateScenario(id: $id, name: $name, folderId: $folderId, description: $description) {
            id
            name
            folderId
            description
        }
    }
`;

export const ADD_SCENARIO = gql`
    mutation createScenario($name: String!, $folderId: Int, $description: String) {
        createScenario(name: $name, folderId: $folderId, description: $description) {
            name
            folderId
            description
        }
    }
`;

export const GET_SCENARIO_INFO = gql`
    query getScenario($id: Int!) {
        scenarios(scenarioId: $id) {
            id
            name
            description
        }
    }
`;
