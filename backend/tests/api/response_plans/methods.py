from typing import List

from api.response_plans.models import ResponsePlan
from api.road_segments.models import RoadSegment
from api.road_conditions.models import RoadCondition


def create_response_plans(operators: List[str],
                          road_segments: List[RoadSegment],
                          road_conditions: List[RoadCondition]) \
        -> List[ResponsePlan]:
    """
    Structure being tested is
       AND
      /   \
    AND   AND <- Can have multiple children
    """
    response_plans = []

    parent = ResponsePlan(road_segment=road_segments[0],
                          operator=operators[0])
    parent.save()
    response_plans.append(parent)
    for x in range(len(operators) - 1):
        child = ResponsePlan(road_segment=road_segments[x],
                             operator=operators[x + 1],
                             road_condition=road_conditions[x],
                             parent=parent)
        child.save()
        response_plans.append(child)
    return response_plans
