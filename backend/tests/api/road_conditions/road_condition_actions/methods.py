from typing import List

from api.instruments.instrument_actions.models import InstrumentAction
from api.instruments.models import InstrumentSystem
from api.road_conditions.road_condition_actions.models import \
    RoadConditionActionGoal, RoadConditionAction, \
    RoadConditionActionToInstrumentAction
from api.road_conditions.road_condition_actions.road_condition_action_constraint.models import \
    RoadConditionActionConstraintType, RoadConditionActionConstraint


def create_road_condition_action_goals(names: List[str]) \
        -> List[RoadConditionActionGoal]:
    action_goals = []
    for name in names:
        action_goal = RoadConditionActionGoal(name=name)
        action_goal.save()
        action_goals.append(action_goal)
    return action_goals


def create_road_condition_actions(names: List[str],
                                  action_goals: List[RoadConditionActionGoal],
                                  instrument_system: InstrumentSystem) \
        -> List[RoadConditionAction]:
    actions = []
    for x in range(len(names)):
        action = RoadConditionAction(action_name=names[x],
                                     road_condition_action_goal=action_goals[
                                         x],
                                     instrument_system=instrument_system)
        action.save()
        actions.append(action)
    return actions


def create_rca_to_ia(rc_actions: List[RoadConditionAction],
                     instrument_actions: List[InstrumentAction]):
    for x in range(len(rc_actions)):
        link = RoadConditionActionToInstrumentAction(
            road_condition_action=rc_actions[0],
            instrument_action=instrument_actions[0])
        link.save()


def create_constraint_types(names: List[str]) -> \
        List[RoadConditionActionConstraintType]:
    types = []
    for name in names:
        new_type = RoadConditionActionConstraintType(name=name)
        new_type.save()
        types.append(new_type)
    return types


def create_constraints(names: List[str],
                       types: List[RoadConditionActionConstraintType]) -> \
        List[RoadConditionActionConstraint]:
    constraints = []
    for x in range(len(names)):
        constraint = RoadConditionActionConstraint(name=names[x],
                                                   constraint_type=types[x])
        constraint.save()
        constraints.append(constraint)
    return constraints
