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


def to_json_response_plan(response_plan: ResponsePlan):
    response_obj = {}
    response_obj['operator'] = response_plan.operator
    response_obj['children'] = []

    if response_plan.road_condition:
        response_obj['road_condition_id'] = response_plan.road_condition.id

    if response_plan.scenario:
        response_obj['scenario_id'] = response_plan.scenario.id

    if response_plan.road_segment:
        response_obj['road_segment_id'] = response_plan.road_segment.id

    for child in ResponsePlan.objects.filter(parent_id=response_plan.id).all():
        response_obj['children'].append(to_json_response_plan(child))

    return response_obj


def import_response_plan(obj):
    id = -1
    try:
        if 'operator' not in obj or 'children' not in obj:
            raise InvalidInputException()

        scenario_id = None
        road_segment_id = None
        road_condition_id = None

        if 'scenario_id' in obj:
            scenario_id = obj['scenario_id']
        if 'road_segment_id' in obj:
            road_segment_id = obj['road_segment_id']
        if 'road_condition_id' in obj:
            road_condition_id = obj['road_condition_id']

        if scenario_id is None and road_segment_id is None:
            raise InvalidInputException()

        response_plan = create_response_plan(road_segment_id,
                                             obj['operator'],
                                             road_condition_id,
                                             scenario_id, None)
        id = response_plan.id
        for child in obj['children']:
            import_child_response_plan(child, id, road_segment_id, scenario_id)
    except ApiException as exc:
        if id != -1:
            delete_response_plan_cascade(id)
        return {"msg": str(exc)}
    return {"id": id}


def import_child_response_plan(child, parent_id, road_segment_id, scenario_id):
    if 'operator' in child:
        road_condition_id = child['road_condition_id'] if 'road_condition_id' in child else None
        response_plan = create_response_plan(road_segment_id,
                                             child['operator'],
                                             road_condition_id,
                                             scenario_id,
                                             parent_id)
        if 'children' in child:
            for c in child['children']:
                import_child_response_plan(
                    c, response_plan.id, road_segment_id, scenario_id)
    else:
        raise InvalidInputException()
