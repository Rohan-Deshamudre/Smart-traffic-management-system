from typing import List

from api.road_conditions.models import RoadCondition
from api.road_segments.models import RoadSegmentType, RoadSegment, \
    RoadSegmentToRoadCondition
from api.scenarios.models import Scenario


def create_road_segment_types(names: List[str]) -> List[RoadSegmentType]:
    types = []
    for name in names:
        type = RoadSegmentType(name=name, description="boomerang")
        type.save()
        types.append(type)
    return types


def create_road_segments(names: List[str], scenarios: List[Scenario],
                         types: List[RoadSegmentType]) \
        -> List[RoadSegment]:
    segments = []
    for x in range(len(names)):
        segment = RoadSegment(name=names[x], scenario=scenarios[x],
                              road_segment_type=types[x])
        segment.save()
        segments.append(segment)
    return segments


def create_rs_to_rc(road_segments: List[RoadSegment],
                    road_conditions: List[RoadCondition]):
    for x in range(len(road_segments)):
        link = RoadSegmentToRoadCondition(road_segment=road_segments[x],
                                          road_condition=road_conditions[x])
        link.save()
