from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException
from api.simulations.methods.create import create_simulation_scene
from api.simulations.methods.getter import get_simulation_with_id, \
    has_simulation_with_id, get_simulation_scene_with_id, \
    has_simulation_scene_with_id, has_simulation_scene_event_with_id, \
    get_simulation_scene_event_with_id
from api.simulations.methods.update import update_simulation_scene_event
from tests.api.road_conditions.methods import create_road_condition_types
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments
from tests.api.scenarios.methods import create_scenarios
from tests.api.simulations.methods import create_simulations, \
    create_simulation_scene_events, create_simulation_scenes


class SimulationMethodsTest(TestCase):
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

    def test_has_and_get_simulation(self):
        simulation = self.simulations[0]
        getter_simulation = get_simulation_with_id(simulation.id)
        self.assertEqual(simulation, getter_simulation)
        self.assertTrue(has_simulation_with_id(simulation.id))

    def test_get_scenario_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_simulation_with_id(-1)

    def test_has_and_get_simulation_scene(self):
        scene = self.scenes[0]
        getter_scene = get_simulation_scene_with_id(scene.id)
        self.assertEqual(scene, getter_scene)
        self.assertTrue(has_simulation_scene_with_id(scene.id))

    def test_get_scenario_scene_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_simulation_scene_with_id(-1)

    def test_has_and_get_simulation_scene_event(self):
        event = self.events[0]
        getter_event = get_simulation_scene_event_with_id(event.id)
        self.assertEqual(event, getter_event)
        self.assertTrue(has_simulation_scene_event_with_id(event.id))

    def test_get_scenario_scene_event_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_simulation_scene_event_with_id(-1)

    def test_create_simulation_scene(self):
        simulation = self.simulations[0]
        time = "2020-10-10T00:00:00Z"
        scene = create_simulation_scene(simulation.id, time, None)
        self.assertEqual(scene.simulation.id, simulation.id)

    def test_update_simulation_scene_event(self):
        event = self.events[0]
        value = 5
        response_plan = "[]"
        update_simulation_scene_event(event.id, None, None, value, response_plan)
        updated_event = get_simulation_scene_event_with_id(event.id)
        self.assertEqual(updated_event.value, value)
