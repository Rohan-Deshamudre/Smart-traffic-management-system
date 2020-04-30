import gql from "graphql-tag";

export const DELETE_SIMULATION = gql`
    mutation DeleteSimulation($id: Int!) {
        deleteSimulation(id: $id) {
            id
        }
    }
`;


export const GET_SIMULATION_SCENE = gql`
    query GetSimulationScene {
        simulating @client
        simulationScene @client {
            id
            time
            simulationSceneEvents {
                id
                roadSegmentId
                roadConditionTypeId
                value
            }
        }
    }
`;


export const GET_SIMULATION_FROM_SCENARIO = gql`
    query GetSimulationStatus($id: Int!) {
        simulations(scenarioId: $id) {
            id
            startTime
            endTime
        }
    }
`;
