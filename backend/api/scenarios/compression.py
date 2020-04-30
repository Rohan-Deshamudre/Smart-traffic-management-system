from api.exception.api_exception import ApiException
from api.road_segments.compression import import_road_segment, \
    to_json_road_segment
from api.scenarios.methods.create import create_scenario
from api.scenarios.methods.getter import get_scenario_with_id
from api.scenarios.models import Scenario

id_key = 'scenario_id'
name_key = 'name'
start_lat_key = 'start_lat'
start_lng_key = 'start_lng'
end_lat_key = 'end_lat'
end_lng_key = 'end_lng'
description_key = 'description'
folder_id_key = 'folder_id'
road_segments_key = 'road_segments'

keys = [name_key, start_lat_key, start_lng_key, end_lat_key, end_lng_key,
        description_key, folder_id_key,
        road_segments_key]


def to_json_scenario_by_id(scenario_id: int):
    try:
        scenario = get_scenario_with_id(scenario_id)
        return to_json_scenario(scenario)
    except ApiException as exc:
        return {"msg": str(exc)}


def to_json_scenario(scenario: Scenario):
    scenario_object = {name_key: scenario.name,
                       start_lat_key: float(scenario.start_lat),
                       start_lng_key: float(scenario.start_lng),
                       end_lat_key: float(scenario.end_lat),
                       end_lng_key: float(scenario.end_lng),
                       description_key: scenario.description,
                       folder_id_key: scenario.folder.id}

    road_segments = scenario.road_segments.all()
    road_segment_array = []
    for rs in road_segments:
        road_segment_array.append(to_json_road_segment(rs))

    scenario_object[road_segments_key] = road_segment_array

    return scenario_object


def import_scenario(json_object):
    scenario_id = -1
    if all((w in json_object for w in keys)):
        name = json_object[name_key]
        description = json_object[description_key]
        folder_id = json_object[folder_id_key]
        scenario = create_scenario(name, folder_id, description, True)

        scenario_id = scenario.id
        print(scenario_id)
        for rs in json_object[road_segments_key]:
            import_road_segment(rs, scenario_id)

    return {id_key: scenario_id}
