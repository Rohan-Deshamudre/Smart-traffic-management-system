from api.exception.api_exception import ObjectNotFoundException
from api.simulations.models import Simulation, SimulationScene, \
    SimulationSceneEvent


def has_simulation_with_id(simulation_id: int) -> bool:
    return Simulation.objects.filter(id=simulation_id).exists()


def get_simulation_with_id(simulation_id: int) -> Simulation:
    if has_simulation_with_id(simulation_id):
        return Simulation.objects.get(id=simulation_id)
    raise ObjectNotFoundException('Simulation', 'id', simulation_id)


def has_simulation_scene_with_id(simulation_scene_id: int) -> bool:
    return SimulationScene.objects.filter(id=simulation_scene_id).exists()


def get_simulation_scene_with_id(simulation_scene_id: int) -> SimulationScene:
    if has_simulation_scene_with_id(simulation_scene_id):
        return SimulationScene.objects.get(id=simulation_scene_id)
    raise ObjectNotFoundException('SimulationScene', 'id', simulation_scene_id)


def has_simulation_scene_event_with_id(simulation_scene_event_id: int) -> bool:
    return SimulationSceneEvent.objects.filter(
        id=simulation_scene_event_id).exists()


def get_simulation_scene_event_with_id(
        simulation_scene_event_id: int) -> SimulationSceneEvent:
    if has_simulation_scene_event_with_id(simulation_scene_event_id):
        return SimulationSceneEvent.objects.get(id=simulation_scene_event_id)
    raise ObjectNotFoundException('SimulationSceneEvent', 'id',
                                  simulation_scene_event_id)
