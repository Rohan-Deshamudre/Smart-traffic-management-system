from typing import List

from api.exception.api_exception import ObjectNotFoundException
from api.road_segments.models import RoadSegment
from api.scenarios.models import Scenario


def has_scenario_with_id(scenario_id: int) -> bool:
    return Scenario.objects.filter(id=scenario_id).exists()


def get_scenario_with_id(scenario_id: int) -> Scenario:
    if has_scenario_with_id(scenario_id):
        return Scenario.objects.get(id=scenario_id)
    raise ObjectNotFoundException('Scenario', 'id', scenario_id)


def get_location(scenario: Scenario):
    '''
    Returns the minimum and maximum coordinates of a scenario
    based on the road_segments it consists of
    '''
    lats = []
    lngs = []
    for road_segment in RoadSegment.objects.filter(scenario=scenario).all():
        if road_segment.route:
            for rs in road_segment.route.route_points.all():
                lats.append(rs.lat)
                lngs.append(rs.lng)
        if len(lats) > 0 and len(lngs) > 0:
            return make_box(lats, lngs)
    return make_box([0], [0])


def make_box(lats: List[float], lngs: List[float]):
    return {
        "min_lat": max(lats),
        "min_lng": min(lngs),
        "max_lat": min(lats),
        "max_lng": max(lngs)
    }
