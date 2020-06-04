from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema
from tests.api.road_conditions.methods import create_road_condition_types
from tests.api.road_segments.methods import create_road_segments, \
    create_road_segment_types
from tests.api.scenarios.methods import create_scenarios
from tests.api.simulations.methods import create_simulations, \
    create_simulation_scenes, create_simulation_scene_events


class SimulationSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.condition_types = create_road_condition_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.segment_types = create_road_segment_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.scenarios = create_scenarios([
            'Test-Scenario-1', 'Test-Scenario-2', 'Test-Scenario-3'],
                                          [None, None, None])
        self.segments = create_road_segments([
            'Test-Name-1', 'Test-Name-2', 'Test-Name-3'], self.scenarios,
                                             self.segment_types)
        self.simulations = create_simulations([
            'Test-Simulation-1', 'Test-Simulation-2', 'Test-Simulation-3'])
        self.scenes = create_simulation_scenes(self.simulations)
        self.events = create_simulation_scene_events(self.scenes,
                                                     self.segments,
                                                     self.condition_types)

    def test_query_simulation_id(self):
        client = Client(schema)
        simulation = self.simulations[0]
        executed = client.execute('''
                                    query {
                                        simulations
                                        (
                                            simulationId: %s
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % simulation.id)
        self.assertEquals(executed['data']['simulations'][0]['name'],
                          simulation.name)

    def test_query_simulation(self):
        client = Client(schema)
        simulation = self.simulations[0]
        scenario = self.scenarios[0]
        scene = self.scenes[0]
        executed = client.execute('''
                                    query {
                                        simulations
                                        (
                                            scenarioId: %s,
                                            name: "%s",
                                            desc: "%s",
                                            sceneId: %s
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (scenario.id, simulation.name,
                                           simulation.description, scene.id))
        self.assertEquals(executed['data']['simulations'][0]['name'],
                          simulation.name)

    def test_query_simulation_scenes_id(self):
        client = Client(schema)
        scene = self.scenes[0]
        executed = client.execute('''
                                    query {
                                        simulationScenes
                                        (
                                            sceneId: %s
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % scene.id)
        self.assertEquals(executed['data']['simulationScenes'][0]['id'],
                          str(scene.id))

    def test_query_simulation_scenes_time(self):
        client = Client(schema)
        scene = self.scenes[0]
        executed = client.execute('''
                                    query {
                                        simulationScenes
                                        (
                                            time: "%s"
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % scene.time)
        self.assertEquals(executed['data']['simulationScenes'][0]['id'],
                          str(scene.id))

    def test_query_simulation_scenes_events_id(self):
        client = Client(schema)
        event = self.events[0]
        executed = client.execute('''
                                    query {
                                        simulationSceneEvents
                                        (
                                            eventId: %s
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % event.id)
        self.assertEquals(executed['data']['simulationSceneEvents'][0]['id'],
                          str(event.id))

    def test_query_simulation_scenes_events(self):
        client = Client(schema)
        event = self.events[0]
        segment = self.segments[0]
        condition_type = self.condition_types[0]
        executed = client.execute('''
                                    query {
                                        simulationSceneEvents
                                        (
                                            roadSegmentId: %s,
                                            roadConditionTypeId: %s
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % (segment.id, condition_type.id))
        self.assertEquals(executed['data']['simulationSceneEvents'][0]['id'],
                          str(event.id))

    def test_create_simulation(self):
        client = Client(schema)
        name = "Boomerang"
        description = "Tori",
        time = "2020-11-11T00:00:00Z"
        segment = self.segments[0]
        condition_type = self.condition_types[0]
        value = 10
        executed = client.execute('''
                                    mutation {
                                        createSimulation (
                                            name: "%s",
                                            description: "%s",
                                            simulationScenes: {
                                                time: "%s",
                                                sceneEvents: {
                                                    roadSegmentId: %s,
                                                    roadConditionTypeId: %s,
                                                    value: %s
                                                }
                                            }
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (name, description, time,
                                           segment.id, condition_type.id,
                                           value))
        self.assertEquals(executed['data']['createSimulation']['name'],
                          name)

    def test_create_simulation_scene(self):
        client = Client(schema)
        simulation = self.simulations[0]
        time = "2020-11-11T00:00:00Z"
        segment = self.segments[0]
        condition_type = self.condition_types[0]
        value = 10
        executed = client.execute('''
                                    mutation {
                                        createSimulationScene (
                                            simulationId: %s
                                            time: "%s",
                                            sceneEvents: {
                                                roadSegmentId: %s,
                                                roadConditionTypeId: %s,
                                                value: %s
                                            }
                                        )
                                        {
                                            simulationId
                                        }
                                    }
                                    ''' % (simulation.id, time, segment.id,
                                           condition_type.id, value))
        self.assertEquals(executed['data']['createSimulationScene']['simulationId'],
                          simulation.id)

    def test_create_simulation_scene_event(self):
        client = Client(schema)
        scene = self.scenes[0]
        segment = self.segments[0]
        condition_type = self.condition_types[0]
        value = 10
        executed = client.execute('''
                                    mutation {
                                        createSimulationEvent (
                                            simulationSceneId: %s,
                                            roadSegmentId: %s,
                                            roadConditionTypeId: %s,
                                            value: %s
                                        )
                                        {
                                            simulationSceneId
                                        }
                                    }
                                    ''' % (scene.id, segment.id,
                                           condition_type.id, value))
        self.assertEquals(executed['data']['createSimulationEvent']['simulationSceneId'],
                          scene.id)

    def test_update_simulation(self):
        client = Client(schema)
        simulation = self.simulations[0]
        name = "Boomerang"
        description = "Tori"
        executed = client.execute('''
                                    mutation {
                                        updateSimulation (
                                            id: %s,
                                            name: "%s",
                                            description: "%s"
                                        )
                                        {
                                            name
                                            description
                                        }
                                    }
                                    ''' % (simulation.id, name, description))
        self.assertEquals(executed['data']['updateSimulation']['name'],
                          name)
        self.assertEquals(executed['data']['updateSimulation']['description'],
                          description)

    def test_update_simulation_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateSimulation
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Simulation with id = -99 does not exist!")

    def test_update_simulation_scene(self):
        client = Client(schema)
        scene = self.scenes[0]
        time = "2020-10-10T20:20:20"
        executed = client.execute('''
                                    mutation {
                                        updateSimulationScene (
                                            id: %s,
                                            time: "%s"
                                        )
                                        {
                                            time
                                        }
                                    }
                                    ''' % (scene.id, time))
        self.assertEquals(executed['data']['updateSimulationScene']['time'],
                          time)

    def test_update_simulation_scene_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateSimulationScene
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Simulationscene with id = -99 does not exist!")

    def test_update_simulation_scene_event(self):
        client = Client(schema)
        event = self.events[0]
        segment = self.segments[1]
        condition_type = self.condition_types[1]
        value = 9
        executed = client.execute('''
                                    mutation {
                                        updateSimulationEvent (
                                            id: %s,
                                            roadSegmentId: %s,
                                            roadConditionTypeId: %s,
                                            value: %s
                                        )
                                        {
                                            roadSegmentId
                                            roadConditionTypeId
                                            value
                                        }
                                    }
                                    ''' % (
                                        event.id, segment.id, condition_type.id,
                                        value))
        self.assertEquals(executed['data']['updateSimulationEvent']['roadSegmentId'],
                          segment.id)
        self.assertEquals(executed['data']['updateSimulationEvent']['value'],
                          value)
        self.assertEquals(executed['data']['updateSimulationEvent']['roadConditionTypeId'],
                          condition_type.id)

        def test_update_simulation_scene_event_exception(self):
            client = Client(schema)
            executed = client.execute('''
                                    mutation {
                                        updateSimulationEvent
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
            self.assertEqual(executed['errors'][0]['message'],
                             "Simulationsceneevent with id = -99 does not exist!")

    def test_delete_simulation(self):
        client = Client(schema)
        simulation = self.simulations[0]
        executed = client.execute('''
                                    mutation {
                                        deleteSimulation
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % simulation.id)
        self.assertEquals(executed['data']['deleteSimulation'], None)

    def test_delete_simulation_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteSimulation
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Simulation with id = -99 does not exist!")

    def test_delete_scene(self):
        client = Client(schema)
        scene = self.scenes[0]
        executed = client.execute('''
                                    mutation {
                                        deleteSimulationScene
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % scene.id)
        self.assertEquals(executed['data']['deleteSimulationScene'], None)

    def test_delete_scene_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteSimulationScene
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Simulationscene with id = -99 does not exist!")

    def test_delete_event(self):
        client = Client(schema)
        event = self.events[0]
        executed = client.execute('''
                                    mutation {
                                        deleteSimulationEvent
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % event.id)
        self.assertEquals(executed['data']['deleteSimulationEvent'], None)

    def test_delete_event_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteSimulationEvent
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Simulationsceneevent with id = -99 does not exist!")
