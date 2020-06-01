from api.exception.api_exception import ObjectNotFoundException
from utils.mapbox import get_polylines
from api.road_segments.models import (
    RoadSegmentType,
    RoadSegment,
    RoadSegmentToRoadCondition,
)


def has_road_segment_type_with_id(road_segment_type_id: int) -> bool:
    return RoadSegmentType.objects.filter(id=road_segment_type_id).exists()


def get_road_segment_type_with_id(road_segment_type_id: int) -> RoadSegmentType:
    if has_road_segment_type_with_id(road_segment_type_id):
        return RoadSegmentType.objects.get(id=road_segment_type_id)
    raise ObjectNotFoundException("RoadSegmentType", "id", road_segment_type_id)


def has_road_segment_with_id(road_segment_id: int) -> bool:
    return RoadSegment.objects.filter(id=road_segment_id).exists()


def get_road_segment_with_id(road_segment_id: int) -> RoadSegment:
    if has_road_segment_with_id(road_segment_id):
        return RoadSegment.objects.get(id=road_segment_id)
    raise ObjectNotFoundException("RoadSegment", "id", road_segment_id)


def has_road_segment_with_road_condition_id(road_condition_id: int) -> bool:
    return RoadSegmentToRoadCondition.objects.filter(
        road_condition=road_condition_id
    ).exists()


def get_road_segment_with_road_condition_id(road_condition_id: int) -> RoadSegment:
    if has_road_segment_with_road_condition_id(road_condition_id):
        return RoadSegmentToRoadCondition.objects.get(
            road_condition=road_condition_id
        ).road_segment
    raise ObjectNotFoundException("RoadSegment", "road_condition_id", road_condition_id)


def get_polylines_with_id(road_segment_id: int):
    road_segment = get_road_segment_with_id(road_segment_id)
    if road_segment.route.id:
        route_points = road_segment.route.route_points.all()
        return get_polylines(route_points)
