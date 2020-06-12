import gql from "graphql-tag";

export const GET_ROAD_CONDITION_INFO = gql`
    query getRoadConditionInfo($id: Int) {
        roadConditions(conditionId: $id) {
            id
            name
            roadConditionDate {
                startCron
                endCron
                startDate
                endDate
                endRepeatDate
            }
            value
            roadConditionType {
                id
                name
            }
        }

        roadSegmentsForRoadCondition: roadSegments(conditionId: $id) {
            route {
                routePoints {
                    lng
                    lat
                }
            }
        }

        instrumentActionRoutesForRoadCondition: instrumentActions(conditionId: $id) {
            text
            routes {
                routePoints {
                    lng
                    lat
                }
            }
        }
    }
`;

export const UPDATE_ROAD_CONDITION = gql`
    mutation updateRoadCondition($id: Int!, $name: String, $startCron: String!, $endCron: String!, $startDate: Date!, $endDate: Date!, $endRepeatDate: String!, $value: String!, $roadConditionTypeId: Int) {
        updateRoadCondition(id: $id, name: $name, date: {startCron: $startCron, endCron: $endCron, startDate: $startDate, endDate: $endDate, endRepeatDate: $endRepeatDate}, value: $value, roadConditionTypeId: $roadConditionTypeId) {
            id
            value
            name
            roadConditionTypeId
        }
    }
`;

export const ADD_ROAD_CONDITION = gql`
    mutation createRoadCondition($name: String!, $startCron: String!, $endCron: String!, $startDate: Date!, $endDate: Date!, $endRepeatDate: String!, $value: String!, $roadConditionTypeId: Int!, $parentRs: Int, $parentRc: Int) {
        createRoadCondition(name: $name, date: {startCron: $startCron, endCron: $endCron, startDate: $startDate, endDate: $endDate, endRepeatDate: $endRepeatDate}, value: $value, roadConditionTypeId: $roadConditionTypeId, parentRc: $parentRc, parentRs: $parentRs) {
            id
            value
            name
            roadConditionTypeId
        }
    }
`;

export const DELETE_ROAD_CONDITION = gql`
    mutation deleteRoadCondition($id: Int!) {
        deleteRoadCondition(id: $id) {
            id
        }
    }
`;

export const GET_ROAD_CONDITION_TYPES = gql`
    query getRoadConditionTypes {
        roadConditionTypes {
            id
            name
        }
    }
`;
