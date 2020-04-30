from typing import List

from api.folders.models import Folder
from api.road_conditions.models import RoadConditionType
from api.road_segments.models import RoadSegment
from api.scenarios.models import Scenario
from api.simulations.models import SimulationScene, Simulation, \
    SimulationSceneEvent


def create_simulation_scene_events(scenes: List[SimulationScene],
                                   segments: List[RoadSegment],
                                   condition_types: List[RoadConditionType]) \
        -> List[SimulationSceneEvent]:
    events = []
    for x in range(len(scenes)):
        event = SimulationSceneEvent(simulation_scene=scenes[x],
                                     road_segment=segments[x],
                                     road_condition_type=condition_types[x],
                                     value=10)
        event.save()
        events.append(event)
    return events


def create_simulation_scenes(simulations: List[Simulation]) \
        -> List[SimulationScene]:
    scenes = []
    for x in range(len(simulations)):
        scene = SimulationScene(simulation=simulations[x],
                                time="2020-11-11T00:00:0" + str(x) + "Z")
        scene.save()
        scenes.append(scene)
    return scenes


def create_simulations(names: List[str]) -> List[Simulation]:
    simulations = []
    for x in range(len(names)):
        simulation = Simulation(name=names[x], description="boomerang")
        simulation.save()
        simulations.append(simulation)
    return simulations
