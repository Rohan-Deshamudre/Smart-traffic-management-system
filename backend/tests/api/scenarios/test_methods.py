from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException, \
    ConstraintException
from api.folders.exceptions import InvalidFolderTypeException
from api.scenarios.methods.create import create_scenario
from api.scenarios.methods.getter import get_scenario_with_id, \
    has_scenario_with_id
from api.scenarios.methods.update import update_scenario, update_scenario_name
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios


class ScenarioMethodsTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['scenarios', 'Test-Type-2', 'Test-Type-3'])
        self.folders = create_folders(['Test-1', 'Test-2', 'Test-3'],
                                      self.folder_types)
        self.scenarios = create_scenarios([
            'Test-Scenario-1', 'Test-Scenario-2', 'Test-Scenario-3'],
            self.folders)
        self.segment_types = create_road_segment_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.segments = create_road_segments([
            'Test-Name-1', 'Test-Name-2', 'Test-Name-3'], self.scenarios,
            self.segment_types)

    def test_has_and_get_scenario(self):
        scenario = self.scenarios[0]
        getter_scenario = get_scenario_with_id(scenario.id)
        self.assertEqual(scenario, getter_scenario)
        self.assertTrue(has_scenario_with_id(scenario.id))

    def test_get_scenario_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_scenario_with_id(-1)

    def test_create_scenario(self):
        name = 'Boomerang'
        description = 'Tori'
        created_scenario = create_scenario(name, None, description)
        self.assertEqual(name, created_scenario.name)
        self.assertEqual(description, created_scenario.description)

    def test_update_scenario_none(self):
        scenario = self.scenarios[0]
        updated_scenario = update_scenario(scenario.id, None, None, None, None)
        self.assertEqual(scenario.name, updated_scenario.name)

    def test_update_scenario_name(self):
        scenario = self.scenarios[0]
        updated_scenario = update_scenario(scenario.id, scenario.name,
                                           None, None, None)
        self.assertEqual(scenario.name, updated_scenario.name)

    def test_update_scenario_name_exception(self):
        scenario = self.scenarios[0]
        name = self.scenarios[1].name
        with self.assertRaises(ConstraintException):
            update_scenario(scenario.id, name,
                            None, None, None)

    def test_update_scenario_name_resolver(self):
        scenario = self.scenarios[0]
        name = self.scenarios[1].name
        update_scenario_name(scenario, name, True)
        scenario.save()
        updated_scenario = get_scenario_with_id(scenario.id)
        self.assertTrue(updated_scenario.name.startswith(name))

    def test_update_scenario_folder_exception(self):
        scenario = self.scenarios[0]
        folder = self.folders[2]
        with self.assertRaises(InvalidFolderTypeException):
            update_scenario(scenario.id, None, folder.id, None, None)
