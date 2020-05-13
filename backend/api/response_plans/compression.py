from api.exception.api_exception import ApiException, InvalidInputException
from api.response_plans.methods import get_response_plan_with_id, \
    create_response_plan, delete_response_plan_cascade
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


def import_response_plan(obj):
    id = -1
    try:
        if 'operator' not in obj or 'road_segment_id' not in obj or 'children' not in obj:
            raise InvalidInputException()

        response_plan = create_response_plan(obj['road_segment_id'],
                                             obj['operator'], None, None)
        id = response_plan.id
        for child in obj['children']:
            import_child_response_plan(child, id, obj['road_segment_id'])
    except ApiException as exc:
        if id != -1:
            delete_response_plan_cascade(id)
        return {"msg": str(exc)}
    return {"id": id}


def import_child_response_plan(child, parent_id, road_segment_id):
    if 'operator' in child:
        road_condition_id = child['road_condition_id'] if 'road_condition_id' in child else None
        response_plan = create_response_plan(road_segment_id,
                                             child['operator'],
                                             road_condition_id,
                                             parent_id)
        if 'children' in child:
            for c in child['children']:
                import_child_response_plan(c, response_plan.id, road_segment_id)
    else:
        raise InvalidInputException()
