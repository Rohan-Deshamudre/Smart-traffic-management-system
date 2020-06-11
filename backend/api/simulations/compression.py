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
        road_segment_type = simulation_scene_event.road_segment.road_segment_type
        road_segment = \
            {'__typename': 'RoadSegment',
             'id': simulation_scene_event.road_segment.id,
             'name': simulation_scene_event.road_segment.name,
             'responsePlanActive': simulation_scene_event.road_segment.response_plan_active,
             'roadSegmentType': {
                 '__typename': 'RoadSegmentType',
                 'id': road_segment_type.id,
                 'name': road_segment_type.name,
                 'img': road_segment_type.img,
                 'description': road_segment_type.description,
             },
             }
        road_condition_type = \
            {'__typename': 'RoadConditionType',
             'id': simulation_scene_event.road_condition_type.id,
             'name': simulation_scene_event.road_condition_type.name,
             'img': simulation_scene_event.road_condition_type.img,
             'description':
                 simulation_scene_event.road_condition_type.description,
             }
        simulation_scene_event_object = \
            {'id': simulation_scene_event.id,
             'roadSegmentId': simulation_scene_event.road_segment_id,
             'roadConditionTypeId':
                 simulation_scene_event.road_condition_type_id,
             'value': simulation_scene_event.value,
             'roadSegment': road_segment,
             'roadConditionType': road_condition_type,
             'responsePlan': simulation_scene_event.response_plan,
             '__typename': 'SimulationSceneEvent',
             }
        simulation_scene_event_array.append(simulation_scene_event_object)
    simulation_scene_object = \
        {'id': simulation_scene.id,
         'time': str(simulation_scene.time.isoformat()),
         'simulationSceneEvents': simulation_scene_event_array,
         '__typename': 'SimulationScene',
         }

    return simulation_scene_object
