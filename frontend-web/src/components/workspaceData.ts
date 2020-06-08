import gql from "graphql-tag";

export const GET_WORKSPACE_DATA = gql`
    query GetWorkspaceData {
        currentTreeId @client
        treeTransform @client
        mapLocation @client
        longitude @client
        latitude @client
        treeIsUpToDate @client
        instrumentActionRoutes @client
        selectedRoute @client
        alternativeRoute @client
        visibleInstruments @client
        selectedInstrumentActionRoutes @client
        curNodeType @client
        treeLevel @client
        workspaceSwapped @client
        
        appData @client {
            mapFocusPoint {
                lat
                lng
                zoom
            }
        }
    
        instruments(instrumentTypeId: 1) {
            id
            name
            lat
            lng
            instrumentActions {
                id
                text
                description
            }
        }
    }
`;

export const GET_TREE = gql`
    query GetTree($id: Int!) {
        scenarios(scenarioId: $id) {
            id
            name
            startLat
            startLng
            responsePlanActive
            roadSegments {
                id
                name
                responsePlanActive
                route {
                    id
                    routePoints {
                        id
                        segment
                        lat
                        lng
                    }
                }
                roadSegmentType {
                    id
                    name
                    img
                }
                roadConditions {
                    ...RCwithThreeChildren
                }
            }
        }

        instrumentActions(scenarioId: $id) {
            routes {
                routePoints {
                    lng
                    lat
                }
            }
        }
    }

    # Fetch Road Condition object with no children
    fragment RC_base on RoadConditionObjectType {
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
            img
        }
        roadConditionActions {
            id
            roadConditionActionGoal {
                id
                name
                img
            }
            instrumentSystem {
                id
                name
            }
            actionName
            description
            constraint {
                id
                name
                constraintType {
                    id
					name
                }
            }
            instrumentActions {
                id
                text
                instrument {
                    id
                    name
                    instrumentType {
						id
						name
					}
                }
                routes {
                    id
                }
            }

        }
    }

    # Fetch Road Condition object with 1 layer of children
    fragment RCwithChildren on RoadConditionObjectType {
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
            img
        }
        roadConditions {
            ...RC_base
        }
        roadConditionActions {
            id
            roadConditionActionGoal {
                id
                name
            }
            instrumentSystem {
                id
                name
            }
            actionName
            description
            constraint {
                id
                name
                constraintType {
                    id
					name
                }
            }
            instrumentActions {
                id
                text
                instrument {
                    id
                    name
                    instrumentType {
						id
                        name
                    }
                }
                routes {
                    id
                }
            }
        }
    }

    # Fetch Road Condition object with 2 layers of children
    fragment RCwithTwoChildren on RoadConditionObjectType {
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
            img
        }
        roadConditions {
            ...RCwithChildren
        }
        roadConditionActions {
            id
            roadConditionActionGoal {
                id
                name
                img
            }
            instrumentSystem {
                id
                name
            }
            actionName
            description
            constraint {
                id
                name
                constraintType {
                    id
					name
                }
            }
            instrumentActions {
                id
                text
                instrument {
                    id
                    name
                    instrumentType {
						id
                        name
                    }
                }
                routes {
                    id
                }
            }
        }
    }

    # Fetch Road Condition object with 1 layer of children
    fragment RCwithThreeChildren on RoadConditionObjectType {
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
            img
        }
        roadConditions {
            ...RCwithTwoChildren
        }
        roadConditionActions {
            id
            roadConditionActionGoal {
                id
                name
                img
            }
            instrumentSystem {
                id
                name
            }
            actionName
            description
            constraint {
                id
                name
                constraintType {
                    id
					name
                }
            }
            instrumentActions {
                id
                text
                instrument {
                    id
                    name
                    instrumentType {
						id
                        name
                    }
                }
                routes {
                    id
                }
            }
        }
    }
`;

