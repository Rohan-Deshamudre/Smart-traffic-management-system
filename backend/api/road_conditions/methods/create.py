from dateutil.parser import parse
import graphene

from api.road_conditions.exceptions import NoParentDefinedForRoadCondition
from api.road_conditions.input_object import RoadConditionDateInputObject
from api.road_conditions.methods.getter import get_road_condition_type_with_id
from api.road_conditions.methods.update import update_parents, \
    replace_road_condition_actions
from api.road_conditions.models import RoadCondition, RoadConditionDate


def create_road_condition(name: str, date: RoadConditionDateInputObject,
                          value: int, road_condition_type_id: int,
                          road_condition_action_ids: graphene.List(
                              graphene.Int),
                          parent_rc: int, parent_rs: int) -> RoadCondition:
    road_condition_type = get_road_condition_type_with_id(
        road_condition_type_id)

    road_condition = RoadCondition(name=name, value=value,
                                   road_condition_type=road_condition_type)

    if parent_rs or parent_rc:
        road_condition.save()
        update_parents(road_condition, parent_rs, parent_rc)
        replace_road_condition_actions(road_condition,
                                       road_condition_action_ids)
        create_road_condition_date(road_condition, date)
        return road_condition

    else:
        raise NoParentDefinedForRoadCondition()


def create_road_condition_date(road_condition: RoadCondition,
                               date: RoadConditionDateInputObject):
    if date:
        road_condition_date = \
            RoadConditionDate(road_condition=road_condition,
                              start_cron=date.start_cron,
                              end_cron=date.end_cron,
                              start_date=date.start_date,
                              end_date=date.end_date)
        try:
            parse(date.end_repeat_date)
            road_condition_date.end_repeat_date = date.end_repeat_date
        except ValueError:
            pass
        road_condition_date.save()
