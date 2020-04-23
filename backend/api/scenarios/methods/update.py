from datetime import datetime

import graphene

from api.exception.api_exception import ConstraintException
from api.folders.exceptions import InvalidFolderTypeException
from api.folders.methods import get_folder_with_id, has_folder_with_id
from api.labels.input_object import LabelInputObject
from api.labels.methods import create_label
from api.scenarios.methods.getter import get_location, get_scenario_with_id
from api.scenarios.models import Scenario, ScenarioToLabel


def update_scenario_folder(scenario: Scenario, folder_id: int):
    """
    Sets the folder the scenario is located in based on a folder ID
    """
    folder = get_folder_with_id(folder_id)
    folder_type = folder.folder_type
    if folder_type.name != "scenarios":
        raise InvalidFolderTypeException("scenarios", folder_type.name)
    scenario.folder = folder


def update_scenario_name(scenario: Scenario, scenario_name: str,
                         resolver: bool = False):
    if scenario.name == scenario_name:
        return
    if not Scenario.objects.filter(name=scenario_name).exists():
        scenario.name = scenario_name
    elif resolver:
        scenario.name = scenario_name + '_' + datetime.now().strftime(
            "(%Y-%m-%d %H:%M:%S.%f)")
    else:
        raise ConstraintException("Scenario", "name", scenario_name)


def update_location(scenario: Scenario):
    location_box = get_location(scenario)
    scenario.start_lat = location_box["min_lat"]
    scenario.start_lng = location_box["min_lng"]
    scenario.end_lat = location_box["max_lat"]
    scenario.end_lng = location_box["max_lng"]
    scenario.save()


def update_scenario(scenario_id: int, name: str, folder_id: int,
                    description: str,
                    labels: graphene.List(LabelInputObject)) -> Scenario:
    scenario = get_scenario_with_id(scenario_id)
    if name:
        update_scenario_name(scenario, name)
    scenario.description = description if description else scenario.description
    if has_folder_with_id(folder_id):
        update_scenario_folder(scenario, folder_id)
    update_location(scenario)

    if labels:
        ScenarioToLabel.objects.filter(scenario_id=scenario.id).delete()
        for l in labels:
            label = create_label(l)
            ScenarioToLabel(scenario=scenario, label=label).save()
    return scenario
