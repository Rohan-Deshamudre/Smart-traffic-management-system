import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import apply = Reflect.apply;
import * as _ from 'lodash';
import { GET_SIMULATION_SCENE } from "../../views/scenario-simulator/SimulationQueries";

export const treeUtils = {
    transformData: transformData,
    replaceChildrenKeys: replaceChildrenKeys,
    getDeactivatedResponsePlan: getDeactivatedResponsePlan
};

let nodeNamesWithChildren = ["roadConditions", "roadConditionActions", "roadSegments"];

function getDeactivatedResponsePlan(client = null) {
    if (client === null) return {};
    let data = client.readQuery({ query: GET_SIMULATION_SCENE });

    let nodes = {};
    if (data.simulating && data.simulationScene !== null) {
        let simulationScene = data.simulationScene;
        simulationScene.simulationSceneEvents.forEach(event => {
            JSON.parse(event.responsePlan)
                .flatMap(getResponsePlanStatuses)
                .forEach(status => {
                    nodes[status.id] = status.active;
                });
        });
    }

    return nodes;
}

function getResponsePlanStatuses(responsePlan) {
    let statuses = [{ id: responsePlan.response_plan_id, active: responsePlan.active }];
    responsePlan.children.forEach(resp => {
        statuses = [...statuses, ...getResponsePlanStatuses(resp)];
    });
    return statuses;
}

function getActiveRoadSegments(simulationScene) {
    let active_segments = {};

    simulationScene.simulationSceneEvents.forEach(event => {
        JSON.parse(event.responsePlan)
            .forEach(responsePlan => {
                active_segments[responsePlan.road_segment_id] = responsePlan.active;
            });

        if (!(event.roadSegmentId in active_segments)) {
            active_segments[event.roadSegmentId] = event.roadSegment.responsePlanActive
        }
    });

    return active_segments;
}

function isRoadSegmentActive(segments, id) {
    return id in segments ? segments[id] : false;
}

/**
 * Transform the data of a scenario so it can be displayed in a tree form.
 * @param scenario
 * @param client
 */
function transformData(scenario: any, client = null) {
    let updatedScenario = _.cloneDeep(scenario);
    let deactivatedNodes = [];
    if (updatedScenario !== undefined) {
        updatedScenario = replaceChildrenKeys([updatedScenario])[0];
    } else {
        return undefined;
    }

    if (client === null) return updatedScenario;
    let data = client.readQuery({ query: GET_SIMULATION_SCENE });
    if (data.simulating && data.simulationScene !== null) {
        let simulationScene = data.simulationScene;
        let eventsPerRoadSegment = squashSegmentEvents(simulationScene);
        let segments = Object.entries(eventsPerRoadSegment);
        let activeRoadSegments = getActiveRoadSegments(simulationScene);
        for (const [segmentId, _] of segments) {
            // Loop through roadsegments in order to find the corresponding segment
            for (let j = 0; j < updatedScenario.children.length; j++) {
                if (updatedScenario.children[j].id === segmentId) {
                    let newlyDeactivatedNodes = [];
                    [updatedScenario.children[j], newlyDeactivatedNodes] = applyRestrictions(
                        updatedScenario.children[j],
                        isRoadSegmentActive(activeRoadSegments, segmentId),
                        deactivatedNodes
                    );
                    deactivatedNodes = [...deactivatedNodes, ...newlyDeactivatedNodes];
                }
            }
        }
    }
    return [updatedScenario, deactivatedNodes];
}

// TODO: Write a test for this function!!
function replaceChildrenKeys(tree: any) {
    tree.active = true;
    for (let key in tree) {
        /*
         Combine children in 'children' array,
         remove empty arrays,
         recursively check all arrays and object for children nodes,
         remove empty objects/arrays
         */
        if (Array.isArray(tree[key]) || (typeof tree[key] === 'object' && tree[key] !== null)) {
            if (tree[key].length === 0) {
                // Delete if key is empty
                delete tree[key];
            } else if (nodeNamesWithChildren.indexOf(key) > -1 && 'children' in tree && Array.isArray(tree[key])) {
                tree['children'] = [...tree['children'], ...replaceChildrenKeys(tree[key])]; // Concatenate existing field
                delete tree[key]; // Delete old field
            } else if (nodeNamesWithChildren.indexOf(key) > -1 && Array.isArray(tree[key])) {
                tree['children'] = replaceChildrenKeys(tree[key]); // Make new field
                delete tree[key]; // Delete old field
            } else {
                tree[key] = replaceChildrenKeys(tree[key]) // Recursively check contents
            }
        }
    }

    return tree;
}

/**
 * RoadSegment ids become keys in an object, the conent of each key is a list of the corresponding events
 * @param simulationScene
 */
function squashSegmentEvents(simulationScene) {
    let eventsPerRoadSegment = {};
    for (let i = 0; i < simulationScene.simulationSceneEvents.length; i++) {
        if (simulationScene.simulationSceneEvents[i].roadSegmentId in eventsPerRoadSegment) {
            eventsPerRoadSegment = {
                ...eventsPerRoadSegment,
                [simulationScene.simulationSceneEvents[i].roadSegmentId]: [
                    ...eventsPerRoadSegment[simulationScene.simulationSceneEvents[i].roadSegmentId],
                    simulationScene.simulationSceneEvents[i]
                ]
            };
        } else {
            eventsPerRoadSegment = {
                ...eventsPerRoadSegment,
                [simulationScene.simulationSceneEvents[i].roadSegmentId]: [simulationScene.simulationSceneEvents[i]]
            }
        }
    }

    return eventsPerRoadSegment;
}

/**
 * Loops over tree to apply restriction to condition nodes recursively
 * @param branch
 * @param active
 * @param deactivatedNodes
 */
function applyRestrictions(branch, active, deactivatedNodes) {
    if (branch.children === undefined) return [branch, deactivatedNodes];

    let updatedBranch = branch;
    let updatedChildren = [];

    for (let i = 0; i < branch.children.length; i++) {
        if (branch.children[i].__typename == "RoadConditionObjectType") {
            if (active) {
                // If the condition is active, return the node with children, and check the children for following conditions
                let newlyUpdatedChildren = [];
                let newlyDeactivatedNodes = [];
                [newlyUpdatedChildren, newlyDeactivatedNodes] = applyRestrictions(branch.children[i], active, deactivatedNodes);
                deactivatedNodes = [...deactivatedNodes, ...newlyDeactivatedNodes];
                updatedChildren = [...updatedChildren, newlyUpdatedChildren];
            } else {
                // If the condition deactivates, only return the condition node
                deactivatedNodes = [...deactivatedNodes, branch.children[i]];
                updatedChildren = [...updatedChildren, deactivateTree(branch.children[i])];
            }
        } else {
            // If the node is not a road condition, no extra funtion is needed as there are no following condition nodes
            updatedChildren = [...updatedChildren, branch.children[i]];
        }
    }

    updatedBranch.children = updatedChildren;
    return [updatedBranch, deactivatedNodes]
}

function deactivateTree(tree: any) {
    let deactivatedTree = _.cloneDeep(tree);
    deactivatedTree.active = false;
    if (deactivatedTree.children !== undefined) {
        let deactivatedChildren = [];
        for (let i = 0; i < deactivatedTree.children.length; i++) {
            deactivatedChildren = [...deactivatedChildren, deactivateTree(deactivatedTree.children[i])]
        }
        deactivatedTree.children = deactivatedChildren;
        return deactivatedTree;
    } else {
        return deactivatedTree;
    }
}

/**
 * Check if one of multiple conditions is active
 * @param conditionObject
 * @param conditions
 */
function isActiveUnderConditions(conditionObject, conditions) {
    for (const condition of conditions) {
        if (parseInt(conditionObject.roadConditionType.id) === condition.roadConditionTypeId) {
            return conditionObject.value >= condition.value;
        }
    }
    return false;
}
