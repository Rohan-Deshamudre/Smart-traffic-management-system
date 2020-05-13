from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException, \
    InvalidInputException
from api.response_plans.exceptions import ResponsePlanIsSameAsParentException, \
    ResponsePlanChildrenAsParentException
from api.response_plans.methods import has_response_plan_with_id, \
    get_all_response_plans, get_response_plan_with_id, \
    get_response_plan_children, create_response_plan, \
    update_response_plan_road_segment, update_response_plan_road_condition, \
    update_response_plan_parent, update_response_plan, \
    delete_response_plan, delete_response_plan_cascade
from tests.api.response_plans.methods import create_response_plans
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios
from api.response_plans.models import ResponsePlan


class ResponsePlanMethodTest(TestCase):
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
        self.response_plans = create_response_plans(
            ['AND', 'AND', 'AND'], self.segments, self.conditions
        )

    def test_has_and_get_response_plan(self):
        response_plan = get_response_plan_with_id(self.response_plans[0].id)
        self.assertEqual(self.response_plans[0], response_plan)
        self.assertTrue(has_response_plan_with_id(self.response_plans[0].id))

    def test_get_response_plan_type_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_response_plan_with_id(-1)

    def test_get_all(self):
        for response_plan in get_all_response_plans():
            self.assertIn(response_plan, self.response_plans)

    def test_get_child(self):
        children = get_response_plan_children(self.response_plans[0])
        for child in children:
            self.assertIn(child, self.response_plans[1:])

    def test_create_response_plan(self):
        response_plan = create_response_plan(self.segments[0].id,
                                             'OR',
                                             self.conditions[1].id,
                                             self.response_plans[2].id)
        created = get_response_plan_with_id(response_plan.id)

        self.assertTrue(len(ResponsePlan.objects.all()),
                        len(get_all_response_plans()))
        self.assertEqual(response_plan, created)

    def test_create_response_plan_exception(self):
        with self.assertRaises(InvalidInputException):
            create_response_plan(None, None, None, None)

    def test_update_road_segment(self):
        update_response_plan_road_segment(self.response_plans[0],
                                          self.segments[1].id)
        self.assertEqual(self.response_plans[0].road_segment,
                         self.segments[1])

    def test_update_road_condition(self):
        update_response_plan_road_condition(self.response_plans[0],
                                            self.conditions[1].id)
        self.assertEqual(self.response_plans[0].road_condition,
                         self.conditions[1])

    def test_update_prent(self):
        update_response_plan_parent(self.response_plans[2],
                                    self.response_plans[1].id)
        self.assertEqual(self.response_plans[2].parent,
                         self.response_plans[1])

    def test_update_same_parent_exception(self):
        with self.assertRaises(ResponsePlanIsSameAsParentException):
            update_response_plan_parent(self.response_plans[0],
                                        self.response_plans[0].id)
    def test_update_parent_with_child(self):
        with self.assertRaises(ResponsePlanChildrenAsParentException):
            update_response_plan_parent(self.response_plans[0],
                                        self.response_plans[1].id)

    def test_update_response_plan(self):
        new_operator = "OR"
        updated = update_response_plan(self.response_plans[1].id,
                             self.segments[2].id,
                             new_operator,
                             self.conditions[1].id,
                             self.response_plans[2].id)

        self.assertEqual(updated.operator, new_operator)
        self.assertEqual(updated.road_segment, self.segments[2])
        self.assertEqual(updated.road_condition, self.conditions[1])
        self.assertEqual(updated.parent, self.response_plans[2])
            
    def test_delete(self):
        create_response_plan(self.segments[0].id,
                             'OR',
                             self.conditions[1].id,
                             self.response_plans[1].id)
        current_len = len(get_all_response_plans())
        delete_response_plan(self.response_plans[1].id)
        self.assertEqual(len(get_all_response_plans()), current_len - 1)

    def test_delete_cascade(self):
        current_len = len(get_all_response_plans())
        delete_response_plan_cascade(self.response_plans[0].id)
        self.assertEqual(len(get_all_response_plans()), 0)
