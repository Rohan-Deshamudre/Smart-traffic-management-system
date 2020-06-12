import * as React from 'react';
import '../../styles/toolbox.scss';
import { Mutation } from "react-apollo";
import RoadConditionToolbox from "./RoadConditionToolbox";
import { ADD_ROAD_CONDITION } from "./RoadConditionToolboxQueries";
import { GET_TREE } from "../../../../components/workspaceData";

type Props = {
    scenarioId: number,
    parentInfo: [number, string],
}

/*
	UpdateRoadCondition component
	Used by [UpdateRoadCondition] in [Scenario-Designer]
	Shows corresponding input fields for a Condition type in the decision tree
	It passes: state to parent.
 */
export default function AddRoadCondition(props: Props) {
    function handleData(mutationFunction, newData) {
        let parentField = props.parentInfo[1] === "RoadSegmentObjectType" ? 'parentRs' : 'parentRc';

        mutationFunction({
            variables: {
                [parentField]: props.parentInfo[0],
                name: newData.name,
                startCron: newData.time.startCron,
                endCron: newData.time.endCron,
                startDate: newData.time.startDate,
                endDate: newData.time.endDate,
                endRepeatDate: newData.time.endRepeatDate,
                value: newData.level,
                roadConditionTypeId: newData.roadConditionTypeId,
                roadConditionActions: []
            },
            refetchQueries: [{ query: GET_TREE, variables: { id: props.scenarioId } }]
        })
    }

    return (
        <Mutation mutation={ADD_ROAD_CONDITION}>
            {(createRoadCondition, callbackData) => (

                <div className='toolbox'>
                    <p>Adding new road condition for parent {props.parentInfo[0]}</p>
                    <RoadConditionToolbox id={props.parentInfo[0]} handleData={(data) => handleData(createRoadCondition, data)} />
                </div>

            )}
        </Mutation>
    );
}
