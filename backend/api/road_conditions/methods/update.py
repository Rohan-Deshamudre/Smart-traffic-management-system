import graphene

from api.road_conditions.input_object import RoadConditionDateInputObject
from api.road_conditions.methods.delete import delete_parents
from api.road_conditions.methods.getter import get_road_condition_with_id, \
    check_road_conditions, get_road_condition_type_with_id, \
    has_road_condition_with_id, get_road_condition_date_with_id, \
    has_road_condition_date_with_id
from api.road_conditions.models import RoadCondition, \
    RoadConditionToRoadConditionAction, RoadConditionToRoadCondition, \
    RoadConditionDate
from api.road_conditions.road_condition_actions.methods.getter import \
    get_road_condition_action_by_id, \
    has_road_condition_action_with_id
from api.road_segments.methods.getter import has_road_segment_with_id, \
    get_road_segment_with_id
from api.road_segments.models import RoadSegmentToRoadCondition
from dateutil.parser import parse


def replace_road_condition_actions(road_condition: RoadCondition,
                                   road_condition_action_ids: graphene.List(
                                       graphene.Int)):
    RoadConditionToRoadConditionAction.objects.filter(
        road_condition=road_condition).delete()
    for road_condition_action_id in road_condition_action_ids:
        if has_road_condition_action_with_id(road_condition_action_id):
            RoadConditionToRoadConditionAction(
                road_condition=road_condition,
                road_condition_action=get_road_condition_action_by_id(
                    road_condition_action_id)).save()


def update_parents(road_condition: RoadCondition, parent_rs: int,
                   parent_rc: int):
    if parent_rs and has_road_segment_with_id(parent_rs):
        delete_parents(road_condition)
        RoadSegmentToRoadCondition(
            road_segment=get_road_segment_with_id(parent_rs),
            road_condition=road_condition).save()
    elif parent_rc and has_road_condition_with_id(parent_rc):
        from_road_condition = get_road_condition_with_id(parent_rc)
        if check_road_conditions(from_road_condition, road_condition):
            delete_parents(road_condition)

            RoadConditionToRoadCondition(
                from_road_condition=from_road_condition,
                to_road_condition=road_condition).save()


def update_road_condition_date(road_condition: RoadCondition,
                               date: RoadConditionDateInputObject):
    if has_road_condition_date_with_id(road_condition.id):
        road_condition_date = get_road_condition_date_with_id(
            road_condition.id)
    else:
        road_condition_date = RoadConditionDate(road_condition=road_condition)
    road_condition_date.start_date = date.start_date
    road_condition_date.end_date = date.end_date
    road_condition_date.start_cron = date.start_cron
    road_condition_date.end_cron = date.end_cron
    try:
        parse(date.end_repeat_date)
        road_condition_date.end_repeat_date = date.end_repeat_date
    except ValueError:
        pass
    road_condition_date.save()
    pass


def update_road_condition(road_condition_id: int, name: str,
                          date: RoadConditionDateInputObject, value: float,
                          road_condition_type_id: int, parent_rs: int,
                          parent_rc: int,
                          road_condition_action_ids: graphene.List(
                              graphene.Int)) -> RoadCondition:
    road_condition = get_road_condition_with_id(road_condition_id)
    road_condition.name = name if name else road_condition.name
    road_condition.value = value if value else road_condition.value
    if road_condition_type_id:
        road_condition.road_condition_type = get_road_condition_type_with_id(
            road_condition_type_id)
    if date:
        update_road_condition_date(road_condition, date)
    road_condition.save()

    if parent_rs or parent_rc:
        update_parents(road_condition, parent_rs, parent_rc)

    if road_condition_action_ids:
        replace_road_condition_actions(road_condition,
                                       road_condition_action_ids)

    return road_condition
