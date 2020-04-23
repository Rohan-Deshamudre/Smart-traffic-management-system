import gql from "graphql-tag";

export const GET_ROAD_CONDITION_ACTION_INFO = gql`
    query GetRoadConditionAction($id: Int) {
        roadConditionActions(actionId: $id) {
            id
            actionName
            constraint {
                id
                name
                constraintType {
                    id
                }
            }
            description
            instrumentSystem {
                id
                name
            }
            instrumentActions {
                id
            }
            roadConditionActionGoal {
                id
            }
        }
    }
`;

export const UPDATE_ROAD_CONDITION_ACTION = gql`
    mutation updateRoadConditionAction($id: Int!,
        $actionName: String,
        $description: String,
        $constraintName: String!,
        $constraintTypeId: Int!,
        $roadConditionActionGoalId: Int,
        $instrumentActionIds: [Int],
        $instrumentSystemId: Int) {
        updateRoadConditionAction(id: $id,
            actionName: $actionName,
            description: $description,
            constraint: {
                type: $constraintTypeId,
                name: $constraintName
            },
            roadConditionActionGoalId: $roadConditionActionGoalId,
            instrumentActionIds: $instrumentActionIds,
            instrumentSystemId: $instrumentSystemId
        ) {
            id
            roadConditionActionGoalId
            instrumentSystemId
            actionName
            instrumentSystemId
            description
        }
    }
`;

export const ADD_ROAD_CONDITION_ACTION = gql`
	mutation createRoadConditionAction($roadConditionId: Int!,
		$actionName: String!,
		$description: String,
		$constraintName: String!,
		$constraintTypeId: Int!,
		$roadConditionActionGoalId: Int!,
		$instrumentActionIds: [Int]!,
		$instrumentSystemId: Int!) {
		createRoadConditionAction(
			roadConditionId: $roadConditionId,
			actionName: $actionName,
			description: $description,
			constraint: {
				type: $constraintTypeId,
				name: $constraintName
			},
			roadConditionActionGoalId: $roadConditionActionGoalId,
			instrumentActionIds: $instrumentActionIds,
			instrumentSystemId: $instrumentSystemId
		) {
			id
			roadConditionActionGoalId
			instrumentSystemId
			actionName
			instrumentSystemId
			description
		}
	}
`;

export const DELETE_ROAD_CONDITION_ACTION = gql`
    mutation DeleteRoadConditionAction($id: Int!) {
        deleteRoadConditionAction(id: $id) {
            id
        }
    }
`;

export const GET_ROAD_CONDITION_ACTION_GOAL_TYPES = gql`
    query GetRoadConditionActionGoalTypes {
        roadConditionActionGoals {
            id
            name
        }
    }
`;

export const GET_INSTRUMENT_SYSTEM_TYPES = gql`
    query GetInstrumentSystemTypes {
        instrumentSystems {
            id
            name
        }
    }
`;

export const GET_CONSTRAINT_TYPES = gql`
    query GetConstraintTypes {
        roadConditionActionConstraintTypes {
            id
            name
            description
        }
    }
`;

export const GET_INSTRUMENT_ACTIONS = gql`
    query GetInstrumentActions {
        instrumentActions {
            id
            text
            instrument {
                id
                name
                instrumentSystem {
                    id
                    name
                }
            }
        }
    }
`

export const GET_INSTRUMENTS = gql`
    query GetInstruments($instrumentSystemId: Int) {
        instruments(instrumentSystemId: $instrumentSystemId) {
            id
            name
            instrumentSystem {
                id
            }
            instrumentActions {
                id
                text
            }
        }
    }
`
