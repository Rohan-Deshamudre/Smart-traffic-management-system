from typing import List

from api.exception.api_exception import ObjectNotFoundException, \
    InvalidInputException
from api.response_plans.exceptions import ResponsePlanIsSameAsParentException, \
    ResponsePlanChildrenAsParentException
from api.response_plans.models import ResponsePlan
from api.road_conditions.methods.getter import get_road_condition_with_id
from api.road_segments.methods.getter import get_road_segment_with_id
from api.scenarios.methods.getter import get_scenario_with_id


def has_response_plan_with_id(response_plan_id: int) -> bool:
    return ResponsePlan.objects.filter(id=response_plan_id).exists()


def get_all_response_plans():
    return ResponsePlan.objects.all()


def get_response_plan_with_id(response_plan_id: int) -> ResponsePlan:
    if has_response_plan_with_id(response_plan_id):
        return ResponsePlan.objects.get(id=response_plan_id)

    raise ObjectNotFoundException("Response Plan", "id", response_plan_id)


def get_response_plan_children(
        response_plan: ResponsePlan) -> List[ResponsePlan]:
    children = []
    for child in ResponsePlan.objects.filter(parent_id=response_plan.id):
        children.append(child)
        children.extend(get_response_plan_children(child))
    return children


def create_response_plan(road_segment_id: int,
                         operator: str,
                         road_condition_id: int,
                         scenario_id: int,
                         parent_id: int) -> ResponsePlan:
    if operator:
        response_plan = ResponsePlan(operator=operator)

        if road_segment_id:
            response_plan.road_segment = get_road_segment_with_id(
                road_segment_id)
        if road_condition_id:
            response_plan.road_condition = get_road_condition_with_id(
                road_condition_id)
        if scenario_id:
            response_plan.scenario = get_scenario_with_id(
                scenario_id)
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


def update_response_plan_scenario(response_plan: ResponsePlan,
                                  scenario_id: int):
    scenario = get_scenario_with_id(scenario_id)
    response_plan.scenario = scenario


def update_response_plan_parent(response_plan: ResponsePlan,
                                parent_id: int):
    if response_plan.id == parent_id:
        raise ResponsePlanIsSameAsParentException()

    parent = get_response_plan_with_id(parent_id)
    if parent in get_response_plan_children(response_plan):
        raise ResponsePlanChildrenAsParentException(
            response_plan.id, parent_id)

    response_plan.parent = parent


def update_response_plan(response_plan_id: int, road_segment_id: int,
                         operator: str, road_condition_id: int,
                         scenario_id: int, parent_id: int):
    response_plan = get_response_plan_with_id(response_plan_id)

    if road_segment_id:
        update_response_plan_road_segment(response_plan,
                                          road_segment_id)

    if operator:
        response_plan.operator = operator

    if road_condition_id:
        update_response_plan_road_condition(response_plan,
                                            road_condition_id)

    if scenario_id:
        update_response_plan_scenario(response_plan,
                                      scenario_id)

    if parent_id:
        update_response_plan_parent(response_plan, parent_id)

    response_plan.save()
    return response_plan


def delete_response_plan(response_plan_id: int):
    response_plan = get_response_plan_with_id(response_plan_id)
    for child in ResponsePlan.objects.filter(parent_id=response_plan.id).all():
        child.parent = response_plan.parent
        child.save()
    response_plan.delete()


def delete_response_plan_cascade(response_plan_id: int):
    response_plan = get_response_plan_with_id(response_plan_id)
    for child in ResponsePlan.objects.filter(parent_id=response_plan.id).all():
        delete_response_plan_cascade(child.id)
    response_plan.delete()
