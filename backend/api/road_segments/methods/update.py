from api.road_segments.methods.getter import get_road_segment_type_with_id, \
    get_road_segment_with_id
from api.road_segments.models import RoadSegment
from api.routes.input_object import RouteInputObject
from api.routes.methods import create_route
from api.scenarios.methods.getter import get_scenario_with_id
from api.scenarios.methods.update import update_location


def update_road_segment(road_segment_id: int, name: str, scenario_id: int,
                        road_segment_type_id: int,
                        route: RouteInputObject) -> RoadSegment:
    road_segment = get_road_segment_with_id(road_segment_id)
    road_segment.name = name if name else road_segment.name
    if scenario_id:
        road_segment.scenario = get_scenario_with_id(scenario_id)

    if road_segment_type_id:
        road_segment.road_segment_type = get_road_segment_type_with_id(
            road_segment_type_id)

    if route:
        r = create_route(route)
        road_segment.route = r

    road_segment.save()
    update_location(road_segment.scenario)

    return road_segment
