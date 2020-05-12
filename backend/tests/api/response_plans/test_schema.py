from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema

from tests.api.response_plans.methods import create_response_plans
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions
from tests.api.road_segments.methods import create_road_segment_types, \
    create_road_segments, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios
from api.response_plans.models import ResponsePlan

class ResponsePlanSchemaTest(TestCase):
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

    def test_query(self):
        client = Client(schema)
        executed = client.execute(
        '''
        query {
            responsePlans(operator: "%s") {
                operator
            }
        }
        ''' % (self.response_plans[0].operator))
        for x in executed['data']['responsePlans']:
            self.assertEqual(x['operator'], 'AND')

    def test_query_id(self):
        client = Client(schema)
        executed = client.execute(
        '''
        query {
            responsePlans(responsePlanId: %s) {
                id
            }
        }
        ''' % self.response_plans[0].id)
        self.assertEqual(executed['data']['responsePlans'][0]['id'],
                         str(self.response_plans[0].id))

    def test_create_response_plan(self):
        operator = 'OR'
        client = Client(schema)
        executed = client.execute(
        '''
        mutation {
            createResponsePlan(operator: "%s", roadSegmentId: %s) {
                operator
            }
        }
        ''' % (operator, self.segments[0].id))
        self.assertEqual(executed['data']['createResponsePlan']['operator'],
                         operator) 

    def test_create_exception(self):
        operator = 'OR'
        client = Client(schema)
        executed = client.execute(
        '''
        mutation {
            createResponsePlan(operator: "%s", roadSegmentId: -99) {
                operator
            }
        }
        ''' % operator)
        self.assertEqual(executed['errors'][0]['message'],
                         "Roadsegment with id = -99 does not exist!")
        
    def test_update(self):
        operator = 'OR'
        client = Client(schema)
        executed = client.execute(
        '''
        mutation {
            updateResponsePlan(id: %s, operator: "%s") {
                id
                operator
            }
        }
        ''' % (self.response_plans[0].id, operator))
        self.assertEqual(executed['data']['updateResponsePlan']['id'],
                         self.response_plans[0].id)
        self.assertEqual(executed['data']['updateResponsePlan']['operator'],
                         operator)

    def test_update_exception(self):
        client = Client(schema)
        executed = client.execute(
        '''
        mutation {
            updateResponsePlan(id: -99) {
                id
            }
        }
        ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Response plan with id = -99 does not exist!")

    def test_delete(self):
        client = Client(schema)
        executed = client.execute(
        '''
        mutation {
            deleteResponsePlan(id: %s) {
                id
            }
        }
        ''' % self.response_plans[2].id)
        self.assertEquals(executed['data']['deleteResponsePlan'],
                          None)

    def test_delete_exception(self):
        client = Client(schema)
        executed = client.execute(
        '''
        mutation {
            deleteResponsePlan(id: -99) {
                id
            }
        }
        ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Response plan with id = -99 does not exist!")
