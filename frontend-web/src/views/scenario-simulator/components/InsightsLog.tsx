import * as React from 'react';
import { Query } from "react-apollo";
import { GET_ROAD_CONDITION_TYPES } from "../../scenario-designer/toolboxes/road-condition/RoadConditionToolboxQueries";


type State = {}

type Props = {
    simulationLog: any;
}

class InsightsLog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    getDescription(type) {
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

    render() {
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

        console.log(this.props.simulationLog);
        let log = this.props.simulationLog.map((log, index) => (
            <div key={index} className="log-item">
                <div className="log-info-message-list">
                    {
                        log.text ? (
                            <div></div>
                        ) : (
                                // @ts-ignore
                                (log.simulationSceneEvents.length > 0) ? (
                                    log.simulationSceneEvents.map(event => (
                                        <section className="stats">
                                            <div className="box">
                                                <div key={event.roadSegmentId.toString() + event.roadConditionTypeId.toString()} className="log-info-message">
                                                    <a>
                                                        <h3>{event.roadConditionType.name}</h3>
                                                    </a>
                                                    <div>
                                                        <img src={
                                                            "../../../assets/tree_icons/road_condition/" + event.roadConditionType.name.toString().toLowerCase().replace(/\s/g, "") + ".svg"
                                                        } width="50" height="50"></img>
                                                        <img src={
                                                            "../../../assets/tree_icons/road_segment/" + event.roadSegment.roadSegmentType.name.toString().replace(/\s/g, "") + ".svg"
                                                        } width="50" height="50"></img>
                                                        <div className="button">
                                                            <i className="fa fa-exclamation-triangle">
                                                                {event.roadSegment.name}
                                                            </i>
                                                        </div>
                                                        <br />
                                                        {this.getDescription(event.roadConditionType.name.toString())}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    ))
                                ) : (
                                        <div className="log-info-message">
                                            Geen verkeersstatussen gevonden.
                                    </div>
                                    )
                            )
                    }
                </div>
            </div>
        ));

        return (
            <div>
                <div>{log}</div>
            </div>
        );
    }
}

export default InsightsLog;
