import graphene

from api.road_conditions.methods.getter import get_road_condition_type_with_id
from api.road_segments.methods.getter import get_road_segment_with_id
from api.simulations.input_object import SimulationSceneInputObject, \
    SimulationSceneEventInputObject
from api.simulations.methods.getter import get_simulation_with_id, \
    get_simulation_scene_with_id
from api.simulations.models import Simulation, SimulationScene, \
    SimulationSceneEvent


def create_simulation(name: str, description: str,
                      simulation_scenes: graphene.List(
                          SimulationSceneInputObject,
                          required=True) = []) -> Simulation:
    simulation = Simulation(name=name, description=description)
    simulation.save()

    add_simulation_scenes_to_simulation(simulation, simulation_scenes)

    return simulation


def create_simulation_scene(simulation_id: int, time,
                            scene_events: graphene.List(
                                SimulationSceneEventInputObject)) \
        -> SimulationScene:
    simulation = get_simulation_with_id(simulation_id)
    simulation_scene = SimulationScene(simulation=simulation, time=time)
    simulation_scene.save()
    if scene_events:
        add_simulation_scenes_events_to_simulation_scene(simulation_scene,
                                                         scene_events)
    return simulation_scene


def create_simulation_scene_event(simulation_scene_id: int,
                                  road_segment_id: int,
                                  road_condition_type_id: int,
                                  value: int,
                                  response_plan: str) -> SimulationSceneEvent:
    simulation_scene = get_simulation_scene_with_id(simulation_scene_id)
    road_segment = get_road_segment_with_id(road_segment_id)
    road_condition_type = get_road_condition_type_with_id(
        road_condition_type_id)
    simulation_scene_event = SimulationSceneEvent(
        simulation_scene=simulation_scene,
        road_segment=road_segment,
        road_condition_type=road_condition_type,
        value=value,
        response_plan=response_plan)
    simulation_scene_event.save()
    return simulation_scene_event


def add_simulation_scenes_to_simulation(simulation,
                                        simulation_scenes: graphene.List(
                                            SimulationSceneInputObject)):
    """
    Creates the simulation scenes for the simulation
    :param simulation: The simulation the simulation scenes belong to
    :param simulation_scenes: The list of simulation scenes
    :return:
    """
    for ss in simulation_scenes:
        simulation_scene = SimulationScene(simulation=simulation, time=ss.time)
        simulation_scene.save()
        add_simulation_scenes_events_to_simulation_scene(simulation_scene,
                                                         ss.scene_events)


def add_simulation_scenes_events_to_simulation_scene(
        simulation_scene,
        simulation_scene_events: graphene.List(
            SimulationSceneEventInputObject)):
    """
    Creates the simulation scene events for the simulation scene
    :param simulation_scene: The simulation scene the events belong to
    :param simulation_scene_events: The list of scene events
    :return:
    """
    for se in simulation_scene_events:
        road_segment = get_road_segment_with_id(se.road_segment_id)
        road_condition_type = get_road_condition_type_with_id(
            se.road_condition_type_id)
        SimulationSceneEvent(simulation_scene=simulation_scene,
                             road_segment=road_segment,
                             road_condition_type=road_condition_type,
                             value=se.value,
                             response_plan=se.response_plan).save()
