from datetime import datetime

import graphene

from api.exception.api_exception import ConstraintException
from api.instruments.instrument_actions.methods.getter import \
    has_instrument_action_with_id, \
    get_instrument_action_with_id
from api.instruments.methods.getter import get_instrument_system_with_id
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions.methods.getter import \
    get_road_condition_action_goal_by_id, \
    get_road_condition_action_by_id
from api.road_conditions.road_condition_actions.models import \
    RoadConditionAction, RoadConditionActionToInstrumentAction
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.methods import \
    update_road_condition_constraint


def replace_instrument_action(road_condition_action: RoadConditionAction,
                              instrument_action_ids: graphene.List(
                                  graphene.Int)):
    RoadConditionActionToInstrumentAction.objects.filter(
        road_condition_action_id=road_condition_action.id).delete()
    for ia_id in instrument_action_ids:
        if has_instrument_action_with_id(ia_id):
            RoadConditionActionToInstrumentAction(
                instrument_action=get_instrument_action_with_id(ia_id),
                road_condition_action=road_condition_action).save()


def update_road_condition_action_name(
        road_condition_action: RoadConditionAction, action_name: str,
        resolver: bool = False):
    if action_name == road_condition_action.action_name:
        return
    if not RoadConditionAction.objects.filter(
            action_name=action_name).exists():
        road_condition_action.action_name = action_name

    elif resolver:

        road_condition_action.action_name = \
            action_name + '_' + datetime.now().strftime(
                "(%Y-%m-%d %H:%M:%S.%f)")
    else:
        raise ConstraintException("RoadConditionAction", "action_name",
                                  action_name)


def update_road_condition_action(road_condition_action_id: int,
                                 instrument_system_id: int, action_name: str,
                                 road_condition_action_goal_id: int,
                                 constraint: RoadConstraintInputObject,
                                 description: str,
                                 instrument_action_ids: graphene.List(
                                     graphene.Int)) -> RoadConditionAction:
    road_condition_action = get_road_condition_action_by_id(
        road_condition_action_id)
    if road_condition_action_goal_id:
        road_condition_action.road_condition_action_goal = \
            get_road_condition_action_goal_by_id(road_condition_action_goal_id)
    if instrument_system_id:
        road_condition_action.instrument_system = \
            get_instrument_system_with_id(instrument_system_id)
    if action_name:
        update_road_condition_action_name(road_condition_action, action_name)
    if constraint:
        update_road_condition_constraint(road_condition_action, constraint)
    road_condition_action.description = description \
        if description else road_condition_action.description

    if instrument_action_ids:
        replace_instrument_action(road_condition_action, instrument_action_ids)

    road_condition_action.save()
    return road_condition_action
