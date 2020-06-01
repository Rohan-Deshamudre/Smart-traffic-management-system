from api.road_conditions.input_object import RoadConditionDateInputObject
from api.road_conditions.methods.create import create_road_condition
from api.road_conditions.methods.getter import (
    get_road_condition_date_with_id,
    has_road_condition_date_with_id,
)
from api.road_conditions.models import RoadCondition
from api.road_conditions.road_condition_actions.compression import (
    import_road_condition_action,
    to_json_road_condition_action,
)

name_key = "name"
time_key = "time"
value_key = "value"
type_key = "type"
road_conditions_key = "road_conditions"
actions_key = "actions"

keys = [name_key, time_key, value_key, type_key, road_conditions_key, actions_key]

start_cron = "start_cron"
end_cron = "end_cron"
start_date = "start_date"
end_date = "end_date"
end_repeat_date = "end_repeat_date"

t_keys = [start_cron, end_cron, start_date, end_date, end_repeat_date]


def to_json_road_condition_time(road_condition_id: int):
    if has_road_condition_date_with_id(road_condition_id):
        road_condition_time = get_road_condition_date_with_id(road_condition_id)
        time_object = {
            start_cron: road_condition_time.start_cron,
            end_cron: road_condition_time.end_cron,
            start_date: road_condition_time.start_date,
            end_date: road_condition_time.end_date,
            end_repeat_date: road_condition_time.end_repeat_date,
        }
        return time_object

    return {}


def to_json_road_condition(road_condition: RoadCondition):
    road_condition_object = {
        name_key: road_condition.name,
        time_key: to_json_road_condition_time(road_condition.id),
        value_key: road_condition.value,
        type_key: road_condition.road_condition_type.id,
    }

    road_condition_action_array = []
    nested_road_condition_array = []
    for rca in road_condition.road_condition_actions.all():
        road_condition_action_array.append(to_json_road_condition_action(rca))

    for nrc in road_condition.road_conditions.all():
        nested_road_condition_array.append(to_json_road_condition(nrc))

    road_condition_object[actions_key] = road_condition_action_array
    road_condition_object[road_conditions_key] = nested_road_condition_array

    return road_condition_object


def create_date_input(time_object) -> RoadConditionDateInputObject:
    if all((w in time_object for w in t_keys)):
        date = RoadConditionDateInputObject()

        date.start_date = time_object[start_date]
        date.end_date = time_object[end_date]
        date.start_cron = time_object[start_cron]
        date.end_cron = time_object[end_cron]
        date.end_repeat_date = time_object[end_repeat_date]
        return date
    return None


def import_road_conditions(json_object, road_segment_id, road_condition_id):
    if all((w in json_object for w in keys)):
        name = json_object[name_key]
        time = create_date_input(json_object[time_key])
        value = json_object[value_key]
        road_condition_type_id = json_object[type_key]
        road_condition = create_road_condition(
            name,
            time,
            value,
            road_condition_type_id,
            [],
            road_condition_id,
            road_segment_id,
        )

        for rs in json_object[road_conditions_key]:
            import_road_conditions(rs, -1, road_condition.id)
        for rci in json_object[actions_key]:
            import_road_condition_action(rci, road_condition.id)
