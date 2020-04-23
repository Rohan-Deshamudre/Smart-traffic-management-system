import graphene

from api.instruments.methods.getter import get_instrument_system_with_id
from api.road_conditions.methods.getter import get_road_condition_with_id
from api.road_conditions.models import RoadConditionToRoadConditionAction
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions.methods.getter import \
    get_road_condition_action_goal_by_id
from api.road_conditions.road_condition_actions.methods.update import \
    replace_instrument_action, \
    update_road_condition_action_name
from api.road_conditions.road_condition_actions.models import \
    RoadConditionAction
from api.road_conditions.road_condition_actions \
    .road_condition_action_constraint.methods import \
    create_road_condition_action_constraint


def create_road_condition_action(road_condition_id: int,
                                 instrument_system_id: int, action_name: str,
                                 road_condition_action_goal_id: int,
                                 constraint: RoadConstraintInputObject,
                                 description: str,
                                 instrument_action_ids: graphene.List(
                                     graphene.Int),
                                 auto_resolver: bool = False) \
        -> RoadConditionAction:
    instrument_system = get_instrument_system_with_id(instrument_system_id)
    road_condition_action_goal = get_road_condition_action_goal_by_id(
        road_condition_action_goal_id)

    new_constraint = create_road_condition_action_constraint(constraint)

    road_condition_action = RoadConditionAction(
        road_condition_action_goal=road_condition_action_goal,
        instrument_system=instrument_system,
        constraint=new_constraint, description=description)
    road_condition = get_road_condition_with_id(road_condition_id)
    update_road_condition_action_name(road_condition_action, action_name,
                                      auto_resolver)
    road_condition_action.save()
    RoadConditionToRoadConditionAction(
        road_condition=road_condition,
        road_condition_action=road_condition_action).save()

    replace_instrument_action(road_condition_action, instrument_action_ids)
    return road_condition_action
