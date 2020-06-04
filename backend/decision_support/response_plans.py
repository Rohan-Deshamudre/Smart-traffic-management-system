from typing import Callable

from api.response_plans.models import ResponsePlan
from api.road_segments.models import RoadSegment
from api.scenarios.models import Scenario
from decision_support.exceptions import InvalidResponsePlanException
from decision_support.road_conditions import is_road_condition_active


def check_road_segments():
    for scenario in Scenario.objects.all():
        road_segments = RoadSegment.objects.filter(scenario=scenario).all()
        for road_segment in road_segments:
            response_plans = get_active_response_plans(road_segment.id)
            is_one_active = False
            for response_plan in response_plans:
                if response_plan['active']:
                    # TODO: Fire conditions
                    print("Response plan with id = %s is active" %
                          response_plan['response_plan_id'])
                    is_one_active = True
            if not is_one_active:
                # TODO: Freeflow activated
                pass


def get_active_response_plans(road_segment_id: int):
    parents = ResponsePlan.objects.filter(
        road_segment_id=road_segment_id
    ).filter(
        parent_id=None
    ).all()

    result = []
    for parent in parents:
        try:
            result.append(is_response_plan_active(parent))
        except Exception as ex:
            print("Invalid Response Plan with id = %s " % parent.id)
    return result


def is_response_plan_active(response_plan: ResponsePlan):
    if response_plan.operator == 'AND':
        return apply_operator(response_plan, True, lambda a, b: a and b)
    elif response_plan.operator == 'OR':
        return apply_operator(response_plan, False, lambda a, b: a or b)
    elif response_plan.road_condition is not None:
        active, description = is_road_condition_active(
            response_plan.road_condition,
            response_plan.road_segment
        )
        return {
            "active": active,
            "description": description,
            "response_plan_id": response_plan.id,
            "road_condition_id": response_plan.road_condition.id,
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
        "response_plan_id": response_plan.id,
        "road_segment_id": response_plan.road_segment.id,
        "scenario_id": response_plan.scenario.id,
        "operator": response_plan.operator,
        "children": children
    }

