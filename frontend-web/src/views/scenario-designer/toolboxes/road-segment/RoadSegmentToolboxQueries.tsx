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
            alternativeRoute {
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
    mutation updateRoadSegment($id: Int!, $name: String, $roadSegmentTypeId: Int, $scenarioId: Int, $route: [RoutePoint], $alternativeRoute: [RoutePoint]) {
        updateRoadSegment(id: $id, name: $name, roadSegmentTypeId: $roadSegmentTypeId, scenarioId: $scenarioId, route: $route, alternativeRoute: $alternativeRoute) {
            id
            name
            roadSegmentType
            scenarioId
            routeId
            alternativeRouteId
        }
    }
`;

export const ADD_ROAD_SEGMENT = gql`
    mutation createRoadSegment($name: String!, $roadSegmentTypeId: Int!, $scenarioId: Int!, $route: [RoutePoint], $alternativeRoute: [RoutePoint]) {
        createRoadSegment(name: $name, roadSegmentTypeId: $roadSegmentTypeId, scenarioId: $scenarioId, route: $route, alternativeRoute: $alternativeRoute) {
            id
            name
            roadSegmentType
            scenarioId
            routeId
            alternativeRouteId
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
