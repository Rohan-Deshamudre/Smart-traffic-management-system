import json

from api.simulations.models import SimulationScene


def simulation_id_to_json(simulation_scene_id):
    """
    Creates a JSON object from a SimulationScene,
     with all SimulationSceneEvent(s).
    This JSON object is in the same format as the GraphQL API
     (SimulationSceneTypeObject)
    :param simulation_scene_id: The id of the SimulationScene
    that has to be modelled.
    """
    simulation_scene = SimulationScene.objects.get(id=simulation_scene_id)
    simulation_scene_event_array = []

    for simulation_scene_event in \
            simulation_scene.simulation_scene_events.all():
        simulation_scene_event_object = \
            {'id': simulation_scene_event.id,
             'roadSegmentId': simulation_scene_event.road_segment_id,
             'roadConditionTypeId':
                 simulation_scene_event.road_condition_type_id,
             'value': simulation_scene_event.value,
             '__typename': 'SimulationSceneEvent'}
        simulation_scene_event_array.append(simulation_scene_event_object)
    simulation_scene_object = \
        {'id': simulation_scene.id,
         'time': str(simulation_scene.time.isoformat()),
         'simulationSceneEvents': simulation_scene_event_array,
         '__typename': 'SimulationScene'}

    return simulation_scene_object
