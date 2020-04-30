from api.road_conditions.models import RoadConditionToRoadConditionAction
from api.road_conditions.road_condition_actions.methods.getter import \
    get_road_condition_action_by_id
from api.road_conditions.road_condition_actions.models import \
    RoadConditionActionToInstrumentAction


def delete_road_condition_action(road_condition_action_id: int):
    road_condition_action = get_road_condition_action_by_id(
        road_condition_action_id)
    RoadConditionToRoadConditionAction.objects.filter(
        road_condition_action=road_condition_action).delete()
    RoadConditionActionToInstrumentAction.objects.filter(
        road_condition_action=road_condition_action).delete()
    road_condition_action.delete()
