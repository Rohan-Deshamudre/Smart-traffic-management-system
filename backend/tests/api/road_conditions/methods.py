from typing import List

from api.road_conditions.models import RoadCondition, RoadConditionType, \
    RoadConditionToRoadConditionAction, \
    RoadConditionToRoadCondition
from api.road_conditions.road_condition_actions.models import \
    RoadConditionAction


def create_road_condition_types(names: List[str]) -> List[RoadConditionType]:
    types = []
    for name in names:
        type = RoadConditionType(name=name, description="tori")
        type.save()
        types.append(type)
    return types


def create_road_conditions(names: List[str], types: List[RoadConditionType]) \
        -> List[RoadCondition]:
    conditions = []
    for x in range(len(names)):
        condition = RoadCondition(name=names[x],
                                  value=10,
                                  road_condition_type=types[x])
        condition.save()
        conditions.append(condition)
    return conditions


def create_rc_to_rca(conditions: List[RoadCondition],
                     actions: List[RoadConditionAction]):
    for x in range(len(conditions)):
        link = RoadConditionToRoadConditionAction(
            road_condition=conditions[x],
            road_condition_action=actions[x])
        link.save()


def create_rc_to_rc(parents: List[RoadCondition],
                    children: List[RoadCondition]):
    for x in range(len(parents)):
        link = RoadConditionToRoadCondition(from_road_condition=parents[x],
                                            to_road_condition=children[x])
        link.save()
