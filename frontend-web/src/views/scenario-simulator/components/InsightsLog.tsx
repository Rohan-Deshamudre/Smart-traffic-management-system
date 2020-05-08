import * as React from 'react';
import * as moment from 'moment';
import { Query } from "react-apollo";
import { GET_ROAD_CONDITION_TYPES } from "../../scenario-designer/toolboxes/road-condition/RoadConditionToolboxQueries";
import Type from "../../../components/other/Type";
import * as _ from 'lodash';

type State = {}

type Props = {
    simulationLog: any;
}

class InsightsLog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
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

        let log = this.props.simulationLog.map((log, index) => (
            <div key={index} className="log-item">
                <div className="log-time-stamp">{log.time}</div>
                {
                    log.text ? (
                        <div className="log-info-message-list">
                            <div className="log-info-message">{log.text}</div>
                        </div>
                    ) : (
                            <div className="log-info-message-list">
                                {
                                    // @ts-ignore
                                    (log.simulationSceneEvents.length > 0) ? (
                                        log.simulationSceneEvents.map(event => (
                                            <section className="stats">
                                                <div className="box">
                                                    <div key={event.roadSegmentId.toString() + event.roadConditionTypeId.toString()}
                                                        className="log-info-message">
                                                        {event.roadConditionType.description}
                                                        <p>
                                                            <a><h3>{conditionString(event.roadConditionType.name)}</h3></a> of level {_.round(event.value, 2)} 
                                                            on {event.roadSegment.name}.
                                                            <p>{event.roadSegment.roadSegmentType.description}</p>
                                                        </p>
                                                        {
                                                            (event.roadConditionType.name.toString() == "Congestion") ? (
                                                                <div>
                                                                    <img src="../../../assets/tree_icons/road_condition/congestion.svg" width="50" height="50"></img>
                                                                    <img src="../../../assets/tree_icons/road_segment/roadsegment.svg" width="50" height="50"></img>
                                                                    <div className="button">
                                                                        <i className="fa fa-exclamation-triangle">
                                                                            {event.roadSegment.name}
                                                                        </i>
                                                                    </div>
                                                                    <br/>
                                                                    <p>This stretch of your route is suffering from congestion which means slow moving traffic,
                                                                        longer trip time and increased vehicular queuing. All vehicles approaching this road segment
                                                                        are advised to take an alternate route until the condition improves.
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                <img src="../../../assets/tree_icons/road_condition/roadwork.svg" width="50" height="50"></img>
                                                                <img src="../../../assets/tree_icons/road_segment/roadsegment.svg" width="50" height="50"></img>
                                                                    <div className="button">
                                                                        <i className="fa fa-exclamation-triangle">
                                                                            {event.roadSegment.name}
                                                                        </i>
                                                                    </div>
                                                                    <br/>
                                                                    <p>This stretch road has been occupied for road repairs and maintenance causing
                                                                        obstructions in your route. All vehicles approaching this road segment are advised to take
                                                                        an alternate route as it may be partially or completely closed.
                                                                    </p>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </section>
                                        ))
                                    ) : (
                                            <div className="log-info-message">
                                                Geen verkeersstatussen gevonden.
                                            </div>
                                        )
                                }
                            </div>
                        )
                }
            </div>
        ));

        return (
            <div>
                <div className="right-pane-simulator-title">Simulatie log</div>
                <div>{log}</div>
            </div>
        );
    }
}

export default InsightsLog;
