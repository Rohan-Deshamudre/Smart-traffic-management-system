import gql from 'graphql-tag';

export const schema = gql`
    type Query {
        appData: ApplicationData
        longitude: Float
        lattitude: Float
        
	mapLocation: String
        
        treeIsUpToDate: Boolean
        curNodeId: Int
        curNodeType: String
	simulationScene: SimulationScene
    }
    
    type SimulationScene {
        id: ID!
        time: String!
        simulationSceneEvents: [SimulationSceneEvent!]!
    }
    
    type SimulationSceneEvent {
        id: ID!
        roadSegmentId: ID!
        roadConditionTypeId: ID!
        value: Int!
        roadSegment: RoadSegment
        roadConditionType: RoadConditionType
    }

    type RoadConditionType {
        id: ID!
        name: String!
        img: String
        description: String
    }

    type RoadSegment {
        id: ID!
        name: String!
        roadSegmentType: RoadSegmentType
    }

    type RoadSegmentType {
        id: ID!
        name: String!
        img: String
        description: String
    }
    
    type ApplicationData {
        mapFocusPoint: Coordinates
    }

    type Coordinates {
        lng: Float
        lat: Float
        zoom: Int
    }

`;
