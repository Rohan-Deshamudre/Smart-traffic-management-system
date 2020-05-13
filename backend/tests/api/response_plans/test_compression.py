from django.test import TestCase

from api.exception.api_exception import ApiException
from tests.api.response_plans.methods import create_response_plans
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios
from api.response_plans.compression import to_json_response_plan_by_id


class ResponsePlanCompressionTest(TestCase):
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

    def test_export(self):
        parent = self.response_plans[0]
        children = [
            { 'operator': self.response_plans[1].operator,
              'road_condition_id': self.response_plans[1].road_condition.id
            },
            { 'operator': self.response_plans[2].operator,
              'road_condition_id': self.response_plans[2].road_condition.id
            }
        ]
        
        response = to_json_response_plan_by_id(parent.id)
        self.assertEqual(response['operator'], parent.operator)
        self.assertEqual(response['road_segment_id'], parent.road_segment.id)

        response_children = []
        for child in response['children']:
            self.assertEqual(0, len(child['children']))
            response_children.append({
                'operator': child['operator'],
                'road_condition_id': child['road_condition_id'],
            })
        self.assertEqual(children, response_children)

    def test_export_exception(self):
        id = -99
        response = to_json_response_plan_by_id(id)
        self.assertEqual(response['msg'],
                         "Response plan with id = %s does not exist!" % id)
            
