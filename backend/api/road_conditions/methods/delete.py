from api.road_conditions.methods.getter import get_road_condition_with_id
from api.road_conditions.models import RoadCondition, \
    RoadConditionToRoadCondition, RoadConditionToRoadConditionAction, \
    RoadConditionDate
from api.road_segments.models import RoadSegmentToRoadCondition


def delete_parents(road_condition: RoadCondition):
    RoadConditionToRoadCondition.objects.filter(
        to_road_condition=road_condition).delete()
    RoadSegmentToRoadCondition.objects.filter(
        road_condition=road_condition).delete()


def delete_road_condition(road_condition_id: int):
    road_condition = get_road_condition_with_id(road_condition_id)
    delete_parents(road_condition)
    RoadConditionToRoadConditionAction.objects.filter(
        road_condition=road_condition).delete()
    from_road_condition = RoadConditionToRoadCondition.objects.filter(
        from_road_condition=road_condition).all()
    RoadConditionDate.objects.filter(
        road_condition_id=road_condition_id).delete()
    for link in from_road_condition:
        delete_road_condition(link.to_road_condition.id)
        link.delete()
    road_condition.delete()
