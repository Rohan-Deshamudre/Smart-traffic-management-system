import gql from "graphql-tag";

export const GET_ROAD_SEGMENT_INFO = gql`
    query getRoadSegmentInfo($id: Int!) {
        roadSegments(segmentId: $id) {
            id
            name
            route {
                id
                routePoints {
                    id
                    lng
                    lat
                }
            }
            roadSegmentType {
                id
                name
            }
        }
    }
`;

export const UPDATE_ROAD_SEGMENT = gql`
    mutation updateRoadSegment($id: Int!, $name: String, $roadSegmentTypeId: Int, $scenarioId: Int, $route: [RoutePoint]) {
        updateRoadSegment(id: $id, name: $name, roadSegmentTypeId: $roadSegmentTypeId, scenarioId: $scenarioId, route: $route) {
            id
            name
            roadSegmentType
            scenarioId
            routeId
        }
    }
`;

export const ADD_ROAD_SEGMENT = gql`
    mutation createRoadSegment($name: String!, $roadSegmentTypeId: Int!, $scenarioId: Int!, $route: [RoutePoint]) {
        createRoadSegment(name: $name, roadSegmentTypeId: $roadSegmentTypeId, scenarioId: $scenarioId, route: $route) {
            id
            name
            roadSegmentType
            scenarioId
            routeId
        }
    }
`;

export const DELETE_ROAD_SEGMENT = gql`
    mutation deleteRoadSegment($id: Int!) {
        deleteRoadSegment(id: $id) {
            id
        }
    }
`;

export const GET_ROAD_SEGMENT_TYPES = gql`
    query GetRoadSegmentTYpes {
        roadSegmentTypes {
            id
            name
            description
        }
    }
`;
