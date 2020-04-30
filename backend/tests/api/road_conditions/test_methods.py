from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException
from api.road_conditions.exceptions import NoParentDefinedForRoadCondition, \
    ExceededRoadConditionChildDepth, \
    CircularRoadCondition, ExceededRoadConditionChildNumbers
from api.road_conditions.methods.create import create_road_condition
from api.road_conditions.methods.delete import delete_road_condition
from api.road_conditions.methods.getter import \
    get_road_condition_type_with_id, has_road_condition_type_with_id, \
    get_road_condition_type_with_name, has_road_condition_type_with_name, \
    get_road_condition_with_id, \
    has_road_condition_with_id, get_road_condition_parents
from api.road_conditions.methods.update import update_parents, \
    update_road_condition
from api.road_conditions.models import RoadConditionToRoadConditionAction
from api.road_segments.models import RoadSegmentToRoadCondition
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.instruments.methods import create_instrument_systems
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions, create_rc_to_rc
from tests.api.road_conditions.road_condition_actions.methods import \
    create_road_condition_action_goals, \
    create_road_condition_actions
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios


class RoadConditionMethodsTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.condition_types = create_road_condition_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3', 'Test-Type-4',
            'Test-Type-5'])
        self.conditions = create_road_conditions([
            'Test-Condition-1', 'Test-Condition-2', 'Test-Condition-3',
            'Test-Condition-4', 'Test-Condition-5'], self.condition_types)
        self.instrument_systems = create_instrument_systems([
            'Test-Sys-1', 'Test-Sys-2', 'Test-Sys-3'])
        self.rc_action_goals = create_road_condition_action_goals([
            'Test-Goal-1', 'Test-Goal-2', 'Test-Goal-3'])
        self.rc_actions = create_road_condition_actions([
            'Test-RCA-1', 'Test-RCA-2', 'Test-RCA-3'],
            self.rc_action_goals, self.instrument_systems[0])
        self.rs_types = create_road_segment_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.folder_types = create_folder_types(
            ['Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.folders = create_folders(['Test-1', 'Test-2', 'Test-3'],
                                      self.folder_types)
        self.scenarios = create_scenarios([
            'Test-Scenario-1', 'Test-Scenario-2', 'Test-Scenario-3'],
            self.folders)
        self.road_segments = create_road_segments([
            'Test-Segment-1', 'Test-Segment-2', 'Test-Segment-3'],
            self.scenarios, self.rs_types)

    def test_has_and_get_condition_type_id(self):
        condition_type = self.condition_types[0]
        getter_condition_type = get_road_condition_type_with_id(
            condition_type.id)
        self.assertEqual(condition_type, getter_condition_type)
        self.assertTrue(has_road_condition_type_with_id(condition_type.id))

    def test_get_condition_type_id_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_condition_type_with_id(-1)

    def test_has_and_get_condition_type_name(self):
        condition_type = self.condition_types[0]
        getter_condition_type = get_road_condition_type_with_name(
            condition_type.name)
        self.assertEqual(condition_type, getter_condition_type)
        self.assertTrue(has_road_condition_type_with_name(condition_type.name))

    def test_get_condition_type_name_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_condition_type_with_name('Boomerang tori')

    def test_has_and_get_condition(self):
        condition = self.conditions[0]
        getter_condition = get_road_condition_with_id(condition.id)
        self.assertEqual(condition, getter_condition)
        self.assertTrue(has_road_condition_with_id(condition.id))

    def test_get_condition_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_condition_with_id(-1)

    def test_condition_creation(self):
        condition_type = self.condition_types[0]
        parent = self.conditions[1]
        action = self.rc_actions[0]
        condition = create_road_condition("New_Name", None,
                                          10, condition_type.id,
                                          [action.id, -1], parent.id, None)
        created_condition = get_road_condition_with_id(condition.id)
        self.assertEqual(condition, created_condition)

    def test_condition_creation_exception(self):
        condition_type = self.condition_types[0]
        with self.assertRaises(NoParentDefinedForRoadCondition):
            create_road_condition("New_Name", None,
                                  10, condition_type.id, None, None, None)

    def test_update_parent_road_segment(self):
        condition = self.conditions[0]
        segment = self.road_segments[0]
        create_rs_to_rc([segment], [condition])
        new_segment = self.road_segments[1]
        update_parents(condition, new_segment.id, None)
        updated_parent = RoadSegmentToRoadCondition.objects.filter(
            road_condition=condition) \
            .first().road_segment
        self.assertEqual(new_segment, updated_parent)

    def test_update_parent_road_condition_correct(self):
        condition = self.conditions[0]
        parent = self.conditions[1]
        grand_parent = self.conditions[2]
        create_rc_to_rc([grand_parent], [parent])
        update_parents(condition, None, parent.id)
        updated_parent = get_road_condition_parents(condition)[0]
        self.assertEqual(parent, updated_parent)

    def test_update_parent_road_condition_none(self):
        condition = self.conditions[0]
        parent = self.conditions[1]
        create_rc_to_rc([parent], [condition])
        update_parents(condition, None, None)
        updated_parent = get_road_condition_parents(condition)[0]
        self.assertEqual(parent, updated_parent)

    def test_update_parent_road_condition_incorrect_depth(self):
        condition = self.conditions[0]
        parent_1 = self.conditions[1]
        parent_2 = self.conditions[2]
        parent_3 = self.conditions[3]
        create_rc_to_rc([parent_1, parent_2], [parent_2, parent_3])
        with self.assertRaises(ExceededRoadConditionChildDepth):
            update_parents(condition, None, parent_3.id)

    def test_update_parent_road_condition_circular(self):
        condition = self.conditions[0]
        parent_1 = self.conditions[1]
        create_rc_to_rc([condition], [parent_1])
        with self.assertRaises(CircularRoadCondition):
            update_parents(condition, None, parent_1.id)

    def test_update_parent_road_condition_two_children(self):
        condition = self.conditions[0]
        parent = self.conditions[1]
        child = self.conditions[2]
        create_rc_to_rc([parent], [child])
        with self.assertRaises(ExceededRoadConditionChildNumbers):
            update_parents(condition, None, parent.id)

    def test_update_road_condition(self):
        condition = self.conditions[0]
        condition_type = self.condition_types[1]
        parent_rc = self.conditions[1]
        rc_action = self.rc_actions[1]
        update_road_condition(condition.id, condition.name, None,
                              condition.value,
                              condition_type.id,
                              None, parent_rc.id, [rc_action.id])
        updated_condition = get_road_condition_with_id(condition.id)
        self.assertEqual(condition_type, updated_condition.road_condition_type)
        self.assertEqual(parent_rc,
                         get_road_condition_parents(updated_condition)[0])
        self.assertEqual(rc_action, RoadConditionToRoadConditionAction
                         .objects.filter(road_condition=updated_condition)
                         .first().road_condition_action)

    def test_delete_road_condition(self):
        condition = self.conditions[0]
        child = self.conditions[1]
        create_rc_to_rc([condition], [child])
        delete_road_condition(condition.id)
        self.assertFalse(has_road_condition_with_id(condition.id))
        self.assertFalse(has_road_condition_with_id(child.id))
