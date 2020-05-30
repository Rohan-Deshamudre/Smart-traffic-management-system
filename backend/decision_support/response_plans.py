from typing import Callable

from api.response_plans.models import ResponsePlan
from decision_support.exceptions import InvalidResponsePlanException
from decision_support.road_conditions import is_road_condition_active


def check_road_segments():
    # TODO: Loop over all road segments and check if the response plans are active
    pass


def get_active_response_plans(road_segment_id: int):
    parents = ResponsePlan.objects.filter(
        road_segment_id=road_segment_id
    ).filter(
        parent_id=None
    ).all()

    result = []
    for parent in parents:
        result.append(is_response_plan_active(parent))
    return result


def is_response_plan_active(response_plan: ResponsePlan):
    if response_plan.operator == 'AND':
        return apply_operator(response_plan, True, lambda a, b: a and b)
    elif response_plan.operator == 'OR':
        return apply_operator(response_plan, False, lambda a, b: a or b)
    elif response_plan.road_condition is not None:
        return {
            "active": is_road_condition_active(
                response_plan.road_condition,
                response_plan.road_segment
            ),
            "response_plan": response_plan,
            "children": []
        }
    else:
        raise InvalidResponsePlanException(response_plan.id)

    
def apply_operator(response_plan: ResponsePlan,
                   active: bool,
                   apply_func: Callable[[bool, bool], bool]):
    children = []
    for child in ResponsePlan.objects.filter(parent_id=response_plan.id).all():
        child_result = is_response_plan_active(child)
        active = apply_func(active, child_result['active'])
        children.append(child_result)

    return {
        "active": active,
        "response_plan": ResponsePlan,
        "children": children
    }

