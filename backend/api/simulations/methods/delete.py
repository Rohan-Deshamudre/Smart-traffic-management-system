from api.simulations.methods.getter import get_simulation_with_id, \
    get_simulation_scene_with_id, \
    get_simulation_scene_event_with_id
from api.simulations.models import SimulationScene, SimulationSceneEvent


def delete_simulation(simulation_id: int):
    simulation = get_simulation_with_id(simulation_id)
    scenes = SimulationScene.objects.filter(simulation=simulation).all()
    for scene in scenes:
        delete_simulation_scene(scene.id)
    simulation.delete()


def delete_simulation_scene(simulation_scene_id):
    simulation_scene = get_simulation_scene_with_id(simulation_scene_id)
    SimulationSceneEvent.objects.filter(
        simulation_scene=simulation_scene).delete()
    simulation_scene.delete()


def delete_simulation_scene_event(simulation_scene_event_id):
    scene_event = get_simulation_scene_event_with_id(simulation_scene_event_id)
    scene_event.delete()
