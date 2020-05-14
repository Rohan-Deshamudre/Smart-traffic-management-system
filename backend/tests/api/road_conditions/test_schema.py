from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions


class RoadConditionSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.condition_types = create_road_condition_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.conditions = create_road_conditions([
            'Test-Condition-1', 'Test-Condition-2', 'Test-Condition-3'],
            self.condition_types)

    def test_query(self):
        client = Client(schema)
        condition = self.conditions[0]
        executed = client.execute('''
                                    query {
                                        roadConditions
                                        (
                                            conditionId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % condition.id)
        self.assertEquals(executed['data']['roadConditions'][0]['name'],
                          condition.name)

    def test_query_type(self):
        client = Client(schema)
        condition_type = self.condition_types[0]
        executed = client.execute('''
                                    query {
                                        roadConditionTypes
                                        (
                                            typeId: %s,
                                            name: "%s",
                                            desc: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (
            condition_type.id, condition_type.name,
            condition_type.description))
        self.assertEquals(executed['data']['roadConditionTypes'][0]['name'],
                          condition_type.name)

    def test_create_correct(self):
        client = Client(schema)
        name = 'Test-Name'
        parent = self.conditions[0]
        condition_type = self.condition_types[0]
        executed = client.execute('''
                                    mutation {
                                        createRoadCondition
                                        (
                                            name: "%s"
                                            value: 10
                                            roadConditionTypeId: %s
                                            parentRc: %s
                                            date: {startCron: "test", endCron: "test", startDate:"2020-11-11", endDate: "2020-11-11", endRepeatDate: "2020-11-11"}
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (
            name, condition_type.id, parent.id))
        self.assertEquals(executed['data']['createRoadCondition']['name'],
                          name)

    def test_update(self):
        client = Client(schema)
        condition = self.conditions[1]
        name = 'New-Name'
        executed = client.execute('''
                                    mutation {
                                        updateRoadCondition
                                        (
                                            id: %s,
                                            name: "%s"
                                            date: {startCron: "test", endCron: "test", startDate:"2020-11-11", endDate: "2020-11-11", endRepeatDate: "2020-11-11"}
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (condition.id, name))
        self.assertEquals(executed['data']['updateRoadCondition']['name'],
                          name)

    def test_delete(self):
        client = Client(schema)
        condition = self.conditions[2]
        executed = client.execute('''
                                    mutation {
                                        deleteRoadCondition
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % condition.id)
        self.assertEquals(executed['data']['deleteRoadCondition'], None)
