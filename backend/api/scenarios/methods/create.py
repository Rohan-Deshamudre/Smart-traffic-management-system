from api.folders.methods import has_folder_with_id
from api.labels.input_object import LabelArrayInputObject
from api.labels.methods import create_label
from api.scenarios.methods.update import \
    update_location, update_scenario_name, \
    update_scenario_folder
from api.scenarios.models import Scenario, ScenarioToLabel


def create_scenario(name: str, folder_id: int, description: str,
                    auto_resolver: bool = False,
                    labels: LabelArrayInputObject = []) -> Scenario:
    scenario = Scenario(description=description)
    update_scenario_name(scenario, name, auto_resolver)

    if has_folder_with_id(folder_id):
        update_scenario_folder(scenario, folder_id)

    update_location(scenario)

    for l in labels:
        label = create_label(l)
        ScenarioToLabel(scenario=scenario, label=label).save()
    scenario.save()
    return scenario
