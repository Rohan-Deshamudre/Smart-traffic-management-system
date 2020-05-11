from typing import List

from api.exception.api_exception import ObjectNotFoundException, \
    InvalidInputException
from api.response_plans.models import ResponsePlan
from api.road_conditions.methods.getter import get_road_condition_with_id
from api.road_segments.methods.getter import get_road_segment_with_id


def has_response_plan_with_id(response_plan_id: int) -> bool:
    return ResponsePlan.objects.filter(id=response_plan_id).exists()


def get_all_response_plans():
    return ResponsePlan.objects.all()


def get_response_plan_with_id(response_plan_id: int) -> ResponsePlan:
    if has_response_plan_with_id(response_plan_id):
        return ResponsePlan.objects.get(id=response_plan_id)

    raise ObjectNotFoundException("Response Plan", "id", response_plan_id)


def create_response_plan(road_segment_id: int,
                         operator: str,
                         road_condition_id: int,
                         parent_id: int) -> ResponsePlan:
    if road_segment_id and operator:
        road_segment = get_road_segment_with_id(road_segment_id)
        response_plan = ResponsePlan(road_segment=road_segment,
                                     operator=operator)
        if road_condition_id:
            response_plan.road_condition = get_road_condition_with_id(
                road_condition_id)
        if parent_id:
            response_plan.parent = get_response_plan_with_id(parent_id)
            
        response_plan.save()
        return response_plan
    else:
        raise InvalidInputException()


def update_response_plan_road_segment(response_plan: ResponsePlan,
                                      road_segment_id: int):
    road_segment = get_road_segment_with_id(road_segment_id)
    response_plan.road_segment = road_segment

    
def update_response_plan_road_condition(response_plan: ResponsePlan,
                                        road_condition_id: int):
    road_condition = get_road_condition_with_id(road_condition_id)
    response_plan.road_condition = road_condition

    
def update_response_plan_parent(response_plan: ResponsePlan,
                                parent_id: int):
    # TODO: Check for loops
    parent = get_response_plan_with_id(parent_id)
    response_plan.parent = parent

    
def update_response_plan(response_plan_id: int, road_segment_id: int,
                         operator: str, road_condition_id: int,
                         parent_id: int):
    response_plan = get_response_plan_with_id(response_plan_id)
    if road_segment_id:
        update_response_plan_road_segment(response_plan,
                                          road_segment_id)
        
    if operator:
        response_plan.operator = operator

    if road_condition_id:
        update_response_plan_road_condition(response_plan,
                                            road_condition_id)

    if parent_id:
        update_response_plan_parent(response_plan, parent_id)
    
    response_plan.save()
    return response_plan


def delete_response_plan(response_plan_id: int):
    response_plan = get_response_plan_with_id(response_plan_id)
    # TODO: Delete children if required
    response_plan.delete()
