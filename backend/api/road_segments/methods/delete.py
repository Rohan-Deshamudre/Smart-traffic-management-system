from api.road_conditions.methods.delete import delete_road_condition
from api.road_segments.methods.getter import get_road_segment_with_id
from api.road_segments.models import RoadSegmentToRoadCondition
from api.simulations.models import SimulationSceneEvent


def delete_road_segment(road_segment_id: int):
    road_segment = get_road_segment_with_id(road_segment_id)
    SimulationSceneEvent.objects.filter(road_segment=road_segment).delete()
    road_conditions = RoadSegmentToRoadCondition.objects.filter(
        road_segment=road_segment).all()
    for link in road_conditions:
        delete_road_condition(link.road_condition.id)
        link.delete()
    road_segment.delete()
