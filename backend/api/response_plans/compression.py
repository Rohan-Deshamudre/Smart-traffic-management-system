from api.exception.api_exception import ApiException
from api.response_plans.methods import get_response_plan_with_id
from api.response_plans.models import ResponsePlan


def to_json_response_plan_by_id(response_plan_id: int):
    try:
        response_plan = get_response_plan_with_id(response_plan_id)
        return to_json_response_plan(response_plan)
    except ApiException as exc:
        return {"msg": str(exc)}


def to_json_response_plan(response_plan: ResponsePlan, first=True):
    response_obj = {}
    response_obj['operator'] = response_plan.operator
    response_obj['children'] = []

    if response_plan.road_condition:
        response_obj['road_condition_id'] = response_plan.road_condition.id
    if first:
        response_obj['road_segment_id'] = response_plan.road_segment.id

    for child in ResponsePlan.objects.filter(parent_id=response_plan.id).all():
        response_obj['children'].append(to_json_response_plan(child, False))
    
    return response_obj
