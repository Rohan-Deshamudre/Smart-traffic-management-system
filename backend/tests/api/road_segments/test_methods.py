from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException

from api.road_conditions.methods.getter import has_road_condition_with_id
from api.road_segments.methods.delete import delete_road_segment
from api.road_segments.methods.getter import get_road_segment_type_with_id, \
    has_road_segment_type_with_id, \
    get_road_segment_with_id, has_road_segment_with_id
from api.road_segments.methods.update import update_road_segment
from api.routes.input_object import RoutePoint
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios


class RoadSegmentMethodsTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
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
        self.condition_types = create_road_condition_types([
            'Test-Type-1', 'Test-Type-2'])
        self.conditions = create_road_conditions([
            'Test-Condition-1', 'Test-Condition-2'], self.condition_types)

    def test_has_and_get_segment_type(self):
        segment_type = self.segment_types[0]
        getter_segment_type = get_road_segment_type_with_id(segment_type.id)
        self.assertEqual(segment_type, getter_segment_type)
        self.assertTrue(has_road_segment_type_with_id(segment_type.id))

    def test_get_segment_type_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_segment_type_with_id(-1)

    def test_has_and_get_segment(self):
        segment = self.segments[0]
        getter_segment = get_road_segment_with_id(segment.id)
        self.assertEqual(segment, getter_segment)
        self.assertTrue(has_road_segment_with_id(segment.id))

    def test_get_segment_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_segment_with_id(-1)

    def test_update_road_segment(self):
        segment = self.segments[0]
        scenario = self.scenarios[0]
        segment_type = self.segment_types[0]
        point = RoutePoint()
        point.lat = 0.0
        point.lng = 1.1
        route = [point]
        update_road_segment(segment.id, 'Test-Segment', scenario.id,
                            segment_type.id, route)
        updated_segment = get_road_segment_with_id(segment.id)
        self.assertEqual(scenario, updated_segment.scenario)
        self.assertEqual(segment_type, updated_segment.road_segment_type)

    def test_update_road_segment_scenario(self):
        segment = self.segments[0]
        scenario = self.scenarios[0]
        update_road_segment(segment.id, 'Test-Segment', scenario.id, None,
                            None)
        updated_segment = get_road_segment_with_id(segment.id)
        self.assertEqual(scenario, updated_segment.scenario)

    def test_delete_road_segment(self):
        segment = self.segments[0]
        condition = self.conditions[0]
        create_rs_to_rc([segment], [condition])
        delete_road_segment(segment.id)
        self.assertFalse(has_road_segment_with_id(segment.id))
        self.assertFalse(has_road_condition_with_id(condition.id))
