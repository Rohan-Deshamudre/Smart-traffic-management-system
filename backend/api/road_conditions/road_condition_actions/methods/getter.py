from api.exception.api_exception import ObjectNotFoundException
from api.road_conditions.road_condition_actions.models import \
    RoadConditionActionGoal, RoadConditionAction


def has_road_condition_action_goal_with_id(
        road_condition_action_goal_id: int) -> bool:
    return RoadConditionActionGoal.objects.filter(
        id=road_condition_action_goal_id).exists()


def get_road_condition_action_goal_by_id(
        road_condition_action_goal_id: int) -> RoadConditionActionGoal:
    if has_road_condition_action_goal_with_id(road_condition_action_goal_id):
        return RoadConditionActionGoal.objects.get(
            id=road_condition_action_goal_id)
    raise ObjectNotFoundException('RoadConditionActionGoal', 'id',
                                  road_condition_action_goal_id)


def has_road_condition_action_with_id(road_condition_action_id: int) -> bool:
    return RoadConditionAction.objects.filter(
        id=road_condition_action_id).exists()


def get_road_condition_action_by_id(
        road_condition_action_id) -> RoadConditionAction:
    if has_road_condition_action_with_id(road_condition_action_id):
        return RoadConditionAction.objects.get(id=road_condition_action_id)
    raise ObjectNotFoundException('RoadConditionAction', 'id',
                                  road_condition_action_id)
