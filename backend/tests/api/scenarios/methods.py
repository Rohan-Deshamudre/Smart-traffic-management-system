from typing import List

from api.folders.models import Folder
from api.scenarios.models import Scenario


def create_scenarios(names: List[str], folders: List[Folder]) \
        -> List[Scenario]:
    scenarios = []
    for x in range(len(names)):
        scenario = Scenario(name=names[x], description="boomerang",
                            start_lat=0, start_lng=0, end_lat=0, end_lng=0,
                            folder=folders[x])
        scenario.save()
        scenarios.append(scenario)
    return scenarios
