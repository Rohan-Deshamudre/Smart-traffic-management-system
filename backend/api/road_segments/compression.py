from api.road_conditions.compression import to_json_road_condition, \
    import_road_conditions
from api.road_segments.methods.create import create_road_segment_with_route_id
from api.road_segments.models import RoadSegment
from api.routes.compression import to_json_route, import_route

name_key = 'name'
route_key = 'route'
type_key = 'type'
road_conditions_key = 'road_conditions'

keys = [name_key, route_key, type_key, road_conditions_key]


def to_json_road_segment(road_segment: RoadSegment):
    road_segment_object = {name_key: road_segment.name,
                           route_key: to_json_route(road_segment.route),
                           type_key: road_segment.road_segment_type.id}

    road_conditions = road_segment.road_conditions.all()
    road_condition_array = []
    for rc in road_conditions:
        road_condition_array.append(to_json_road_condition(rc))

    road_segment_object[road_conditions_key] = road_condition_array

    return road_segment_object


def import_road_segment(json_object, scenario_id):
    if all((w in json_object for w in keys)):

        route_id = import_route(json_object[route_key])
        name = json_object[name_key]
        road_segment_type_id = json_object[type_key]
        road_segment = create_road_segment_with_route_id(name, scenario_id,
                                                         road_segment_type_id,
                                                         route_id)

        for rs in json_object[road_conditions_key]:
            import_road_conditions(rs, road_segment.id, -1)
