from api.exception.api_exception import ObjectNotFoundException
from api.road_segments.models import RoadSegmentType, RoadSegment


def has_road_segment_type_with_id(road_segment_type_id: int) -> bool:
    return RoadSegmentType.objects.filter(id=road_segment_type_id).exists()


def get_road_segment_type_with_id(
        road_segment_type_id: int) -> RoadSegmentType:
    if has_road_segment_type_with_id(road_segment_type_id):
        return RoadSegmentType.objects.get(id=road_segment_type_id)
    raise ObjectNotFoundException('RoadSegmentType', 'id',
                                  road_segment_type_id)


def has_road_segment_with_id(road_segment_id: int) -> bool:
    return RoadSegment.objects.filter(id=road_segment_id).exists()


def get_road_segment_with_id(road_segment_id: int) -> RoadSegment:
    if has_road_segment_with_id(road_segment_id):
        return RoadSegment.objects.get(id=road_segment_id)
    raise ObjectNotFoundException('RoadSegment', 'id', road_segment_id)
