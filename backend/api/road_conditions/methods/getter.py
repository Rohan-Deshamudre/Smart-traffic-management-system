from typing import List

from api.exception.api_exception import ObjectNotFoundException
from api.road_conditions.exceptions import ExceededRoadConditionChildDepth, \
    ExceededRoadConditionChildNumbers, \
    CircularRoadCondition
from api.road_conditions.models import RoadConditionType, RoadCondition, \
    RoadConditionToRoadCondition, RoadConditionDate


def has_road_condition_date_with_id(road_condition_id: int) -> bool:
    return RoadConditionDate.objects.filter(
        road_condition_id=road_condition_id).exists()


def get_road_condition_date_with_id(road_condition_id: int) -> \
        RoadConditionDate:
    return RoadConditionDate.objects.get(road_condition_id=road_condition_id)


def has_road_condition_type_with_id(road_condition_type_id: int) -> bool:
    return RoadConditionType.objects.filter(id=road_condition_type_id).exists()


def get_road_condition_type_with_id(
        road_condition_type_id: int) -> RoadCondition:
    if has_road_condition_type_with_id(road_condition_type_id):
        return RoadConditionType.objects.get(id=road_condition_type_id)
    raise ObjectNotFoundException('RoadConditionType', 'id',
                                  road_condition_type_id)


def has_road_condition_type_with_name(name: str) -> bool:
    return RoadConditionType.objects.filter(name=name).exists()


def get_road_condition_type_with_name(name: str) -> RoadCondition:
    if has_road_condition_type_with_name(name):
        return RoadConditionType.objects.get(name=name)
    raise ObjectNotFoundException('RoadConditionType', 'name', name)


def check_road_conditions(from_rc: RoadCondition,
                          to_rc: RoadCondition) -> bool:
    """
    Checks if the road condition tree constraints are satisfied:
        - There should not be more than 3 road conditions in a road segment
        - A road condition should not have multiple children on the
        same tree depth
        - Road condition A cannot be a child of road condition B if
        road condition B is a child of road condition A
    """
    parents = get_road_condition_parents(from_rc)
    if len(parents) >= 2:
        raise ExceededRoadConditionChildDepth()
    if RoadConditionToRoadCondition.objects.filter(
            from_road_condition=from_rc).first():
        raise ExceededRoadConditionChildNumbers(from_rc.id)
    for p in parents:
        if p == to_rc:
            raise CircularRoadCondition(from_rc.id, to_rc.id)
    return True


def has_road_condition_with_id(road_condition_id: int) -> bool:
    return RoadCondition.objects.filter(id=road_condition_id).exists()


def get_road_condition_with_id(road_condition_id: int) -> RoadCondition:
    if has_road_condition_with_id(road_condition_id):
        return RoadCondition.objects.get(id=road_condition_id)
    raise ObjectNotFoundException('RoadCondition', 'id', road_condition_id)


def get_road_condition_parents(road_condition: RoadCondition) -> \
        List[RoadCondition]:
    """
    Gets the parent road conditions of the given road condition
    """
    parents = []
    for link in RoadConditionToRoadCondition.objects.filter(
            to_road_condition=road_condition).all():
        rc = link.from_road_condition
        parents = parents + [rc] + get_road_condition_parents(rc)
    return parents
