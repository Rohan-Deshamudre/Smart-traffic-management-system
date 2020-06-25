import * as React from 'react';
import Button from "react-bootstrap/Button";
import { Query } from "react-apollo";
import { GET_ROAD_CONDITION_TYPES } from "../../scenario-designer/toolboxes/road-condition/RoadConditionToolboxQueries";
import PaneBottomButtons from './PaneBottomButtons';

function highlighRoad(event) {

}

let getDescription = (type) => {
    switch (type) {
        case "Broken Car":
            return <p>
                A vehicle malfunction has caused slight disruptions in this segment of road causing a slight increase in vehicular
                queueing and travel time. In order to prevent any further problems, all vehicles are advised to
                proceed with caution or take an alternate route if possible.
            </p>
        case "Accident":
            return <p>
                One or more vehicles have met with an accident causing disruptions and delays on
                this stretch of road. The necessary measures to deal with the incident and to prevent further
                issues are currently in progress and all vehicles are advised to take an alternate route until the disruptions are resolved.
            </p>
        case "Congestion":
            return <p>
                This stretch of your route is suffering from congestion which means slow moving traffic,
                longer trip time and increased vehicular queuing. All vehicles approaching this road segment
                are advised to take an alternate route until the condition improves.
            </p>
        case "Event":
            return <p>
                This stretch of road has been occupied for an event which may mean it is partially or completely closed for vehicles.
                To avoid delays, all vehicles are advised to take an alternate route until the event has been cleared.
            </p>
        default:
            return <p>
                This stretch road has been occupied for repairs and maintenance causing
                obstructions in your route. All vehicles approaching this road segment are advised to take
                an alternate route as it may be partially or completely closed.
            </p>
    }
}

let conditionString = (id) => (
    <Query query={GET_ROAD_CONDITION_TYPES}>
        {
            ({ data, loading, error }) => {
                if (loading) return <p>Loading</p>;
                if (error) return <p>Error</p>;

                for (let type of data.roadConditionTypes) {
                    if (parseInt(type.id) === id) {
                        return (
                            type.name
                        );
                    }
                }

                return id;
            }
        }
    </Query>
);

let getRoadConditionDescriptions = responsePlan => (
    <div >
        {
            responsePlan.description
                ? responsePlan.active
                        ? <p className="activeCondition">{responsePlan.description}</p>
                        : <p className="inactiveCondition">{responsePlan.description}</p>
                : responsePlan.children.map(getRoadConditionDescriptions)
        }
    </div>
);

let displayResponsePlan = (responsePlan, index) => (
    <div>
        <p>Response Plan #{index + 1} {responsePlan.active ? <span>Active</span> : <span>Not Active</span>}</p>
        {getRoadConditionDescriptions(responsePlan)}
        <p>Operator: {responsePlan.operator}</p>
        <hr />
    </div>
);

let displaySimulationSceneEvent = (event) => {
    const insightText = JSON.parse(event.responsePlan).map(displayResponsePlan);
    
    return (
        insightText.length > 0 ? 
            <section className="stats">
                <div className="box">
                    <div key={event.roadSegmentId.toString() + event.roadConditionTypeId.toString()} className="log-info-message">
                        <h3>{event.roadSegment.name}</h3>
                        {/* <Button onClick={() => highlighRoad(event)}>Highlight Road</Button> */}
                        {insightText}
                    </div>
                </div>
            </section>
            : null
    );
};

let displaySimulationLog = (log, index) => (
    <div key={index} className="log-item">
        <div className="log-info-message-list">
            {
                !log.text ? log.simulationSceneEvents.map(displaySimulationSceneEvent) : null
            }
        </div>
    </div>
);

export default function InsightsLog(props) {
    return (
        <div>
            {props.simulationLog.map(displaySimulationLog)}
        </div>
    );
}
