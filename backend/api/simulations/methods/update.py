import graphene

from api.road_conditions.methods.getter import get_road_condition_type_with_id
from api.road_segments.methods.getter import get_road_segment_with_id
from api.simulations.methods.getter import get_simulation_with_id, \
    get_simulation_scene_with_id, \
    get_simulation_scene_event_with_id
from api.simulations.models import SimulationSceneEvent, SimulationScene, \
    Simulation


def update_simulation(simulation_id: int, name: str,
                      description: str) -> Simulation:
    simulation = get_simulation_with_id(simulation_id)
    simulation.name = name if name else simulation.name
    simulation.description = description \
        if description else simulation.description
    simulation.save()
    return simulation


def update_simulation_scene(simulation_scene_id: int,
                            time: graphene.DateTime) -> SimulationScene:
    simulation_scene = get_simulation_scene_with_id(simulation_scene_id)
    simulation_scene.time = time if time else simulation_scene.time
    simulation_scene.save()
    return simulation_scene


def update_simulation_scene_event(simulation_scene_event_id: int,
                                  road_segment_id: int,
                                  road_condition_type_id: int,
                                  value: int) -> SimulationSceneEvent:
    simulation_scene_event = get_simulation_scene_event_with_id(
        simulation_scene_event_id)
    if road_segment_id:
        simulation_scene_event.road_segment = get_road_segment_with_id(
            road_segment_id)

    if road_condition_type_id:
        simulation_scene_event.road_condition_type = \
            get_road_condition_type_with_id(road_condition_type_id)

    simulation_scene_event.value = value \
        if value else simulation_scene_event.value
    simulation_scene_event.save()

    return simulation_scene_event
