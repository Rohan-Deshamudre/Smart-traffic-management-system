from api.road_segments.methods.getter import get_road_segment_type_with_id
from api.road_segments.models import RoadSegment
from api.routes.input_object import RouteInputObject
from api.routes.methods import create_route
from api.scenarios.methods.getter import get_scenario_with_id
from api.scenarios.methods.update import update_location


def create_road_segment(name: str, scenario_id: int, road_segment_type_id: int,
                        route: RouteInputObject,
                        alternative_route: RouteInputObject) -> RoadSegment:
    route = create_route(route)
    alternative_route = create_route(alternative_route)
    road_segment = create_road_segment_with_route_id(name, scenario_id,
                                                     road_segment_type_id,
                                                     route.id,
                                                     alternative_route.id)
    return road_segment


def create_road_segment_with_route_id(name: str, scenario_id: int,
                                      road_segment_type_id: int,
                                      route_id: int,
                                      alternative_route_id: int) -> RoadSegment:
    scenario = get_scenario_with_id(scenario_id)
    road_segment_type = get_road_segment_type_with_id(road_segment_type_id)
    road_segment = RoadSegment(name=name, scenario=scenario,
                               road_segment_type=road_segment_type,
                               route_id=route_id,
                               alternative_route_id=alternative_route_id)
    road_segment.save()
    update_location(scenario)
    return road_segment
