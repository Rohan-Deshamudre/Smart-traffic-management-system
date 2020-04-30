from api.road_segments.methods.delete import delete_road_segment
from api.road_segments.models import RoadSegment
from api.scenarios.methods.getter import get_scenario_with_id
from api.scenarios.models import ScenarioToLabel


def delete_scenario(scenario_id: int):
    """
    Deletes the scenario, and the connected road_segments
    :param scenario: The scenario to be deleted
    :return:
    """
    scenario = get_scenario_with_id(scenario_id)

    ScenarioToLabel.objects.filter(scenario_id=scenario.id).delete()
    road_segments = RoadSegment.objects.filter(scenario=scenario).all()
    for rs in road_segments:
        delete_road_segment(rs.id)
    scenario.delete()
