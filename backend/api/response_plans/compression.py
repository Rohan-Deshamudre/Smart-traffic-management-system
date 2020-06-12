from api.exception.api_exception import ApiException, InvalidInputException
from api.response_plans.methods import get_response_plan_with_id, \
    create_response_plan, delete_response_plan_cascade
from api.road_conditions.methods.create import create_road_condition
from api.response_plans.models import ResponsePlan


def to_json_response_plan_by_id(response_plan_id: int):
    try:
        response_plan = get_response_plan_with_id(response_plan_id)
        return to_json_response_plan(response_plan)
    except ApiException as exc:
        return {"msg": str(exc)}


def to_json_response_plan_by_scenario(scenario_id: int):
    response_plans = ResponsePlan.objects.filter(
        scenario_id=scenario_id
    ).filter(
        parent_id=None
    ).all()
    response = []
    for resp in response_plans:
        response.append(to_json_response_plan(resp))
    return response


def to_json_response_plan_by_road_segment(road_segment_id: int):
    response_plans = ResponsePlan.objects.filter(
        road_segment_id=road_segment_id
    ).filter(
        parent_id=None
    ).all()
    response = []
    for resp in response_plans:
        response.append(to_json_response_plan(resp))
    return response


def to_json_response_plan(response_plan: ResponsePlan):
    response_obj = {}
    response_obj['id'] = response_plan.id
    response_obj['__typename'] = 'ResponsePlan'
    response_obj['operator'] = response_plan.operator
    response_obj['children'] = []

    if response_plan.road_condition:
        condition = response_plan.road_condition
        response_obj['road_condition_id'] = condition.id
        response_obj['road_condition'] = {
            '__typename': 'RoadCondition',
            'id': condition.id,
            'name': condition.name,
            'value': condition.value,
            'roadConditionType': {
                '__typename': 'RoadConditionType',
                'id': condition.road_condition_type.id,
                'name': condition.road_condition_type.name,
                'img': condition.road_condition_type.img,
                'description': condition.road_condition_type.description,
            }
        }

    if response_plan.scenario:
        response_obj['scenario_id'] = response_plan.scenario.id

    if response_plan.road_segment:
        response_obj['road_segment_id'] = response_plan.road_segment.id

    for child in ResponsePlan.objects.filter(parent_id=response_plan.id).all():
        response_obj['children'].append(to_json_response_plan(child))

    return response_obj


def import_response_plan(obj, parent_id=None):
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

        if scenario_id is None and road_segment_id is None:
            raise InvalidInputException()

        if 'road_condition' in obj:
            road_condition = obj['road_condition']
            if 'name' not in road_condition or 'value' not in road_condition:
                raise InvalidInputException()

            type_id = -1
            if 'road_condition_type_id' in road_condition:
                type_id = road_condition['road_condition_type_id']
            elif 'roadConditionType' in road_condition and 'id' in road_condition['roadConditionType']:
                type_id = road_condition['roadConditionType']['id']
            else:
                raise InvalidInputException()

            condition = create_road_condition(
                road_condition['name'],
                None,
                road_condition['value'],
                type_id,
                [], None, road_segment_id)
            road_condition_id = condition.id
        elif 'road_condition_id' in obj:
            road_condition_id = obj['road_condition_id']

        response_plan = create_response_plan(road_segment_id,
                                             obj['operator'],
                                             road_condition_id,
                                             scenario_id,
                                             parent_id)
        id = response_plan.id
        for child in obj['children']:
            import_response_plan(child, id)
    except ApiException as exc:
        if id != -1:
            delete_response_plan_cascade(id)
        if parent_id is None:
            return {"msg": str(exc)}
        else:
            raise InvalidInputException()
    return {"id": id}
