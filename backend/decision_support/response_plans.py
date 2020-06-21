from typing import Callable

import json
from api.response_plans.models import ResponsePlan
from api.road_segments.models import RoadSegment
from api.scenarios.models import Scenario
from decision_support.exceptions import InvalidResponsePlanException
from decision_support.road_conditions import is_road_condition_active
from notifications.push_notifications import push_notification


def check_road_segments():
    scenario_active = False
    for scenario in Scenario.objects.all():
        scenario_insights = []
        road_segment_active = False
        road_segments = RoadSegment.objects.filter(scenario=scenario).all()
        for road_segment in road_segments:
            response_plans = get_active_response_plans(road_segment.id)
            is_one_active = False
            for response_plan in response_plans:
                if response_plan['active']:
                    # Conditions are active
                    print("Response plan with id = %s is active" %
                          response_plan['response_plan_id'])
                    scenario_active = True
                    road_segment_active = True
                    is_one_active = True
            if not is_one_active:
                # Freeflow activated
                pass

            if road_segment_active:
                send_notification(road_segment)

            insight = {
                'roadSegmentId': road_segment.id,
                'roadConditionTypeId': 0,
                'roadSegment': { 'name': road_segment.name },
                'responsePlan': json.dumps(response_plans)
            }
            scenario_insights.append(insight)
            road_segment.response_plan_active = road_segment_active
            road_segment.insights = json.dumps([insight])
            road_segment.save()
            road_segment_active = False

        scenario.response_plan_active = scenario_active
        scenario.insights = json.dumps(scenario_insights)
        scenario.save()
        scenario_active = False


def send_notification(road_segment: RoadSegment):
    body_notification = "Congestion"
    for condition in road_segment.road_conditions.all():
        if condition.road_condition_actions.count() > 0:
            body_notification = condition.name

    push_notification(road_segment.name, body_notification)


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
            print("Invalid Response Plan with id = %s , Error = %s " %
                  (parent.id, ex))
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

