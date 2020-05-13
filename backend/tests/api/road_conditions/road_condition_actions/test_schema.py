from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema
from tests.api.instruments.instrument_actions.methods import \
    create_instrument_actions
from tests.api.instruments.methods import create_instrument_types, \
    create_instruments, create_instrument_systems
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions, create_rc_to_rca
from tests.api.road_conditions.road_condition_actions.methods import \
    create_road_condition_action_goals, \
    create_road_condition_actions, create_rca_to_ia, create_constraint_types, create_constraints


class RoadConditionActionSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.instrument_types = create_instrument_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.instrument_systems = create_instrument_systems([
            'Test-Sys-1', 'Test-Sys-2', 'Test-Sys-3'])
        self.instruments = create_instruments([
            'Test-Instr-1', 'Test-Instr-2', 'Test-Instr-3'],
            self.instrument_types[0], self.instrument_systems[0])
        self.instrument_actions = create_instrument_actions(self.instruments)
        self.rc_action_goals = create_road_condition_action_goals([
            'Test-Goal-1', 'Test-Goal-2', 'Test-Goal-3'])
        self.rc_actions = create_road_condition_actions([
            'Test-RCA-1', 'Test-RCA-2', 'Test-RCA-3'],
            self.rc_action_goals, self.instrument_systems[0])
        create_rca_to_ia(self.rc_actions, self.instrument_actions)
        self.condition_types = create_road_condition_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.conditions = create_road_conditions([
            'Test-Condition-1', 'Test-Condition-2', 'Test-Condition-3'],
            self.condition_types)
        create_rc_to_rca(self.conditions, self.rc_actions)
        self.constraint_types = \
            create_constraint_types([
                'Type-1', 'Type-2', 'Type-3'])
        self.constraints = create_constraints([
            'Constraint-1', 'Constraint-2', 'Constraint-3'],
            self.constraint_types)

    def test_query(self):
        client = Client(schema)
        action = self.rc_actions[0]
        executed = client.execute('''
                                    query {
                                        roadConditionActions
                                        (
                                            actionId: %s,
                                        )
                                        {
                                            actionName
                                        }
                                    }
                                    ''' % action.id)
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('roadConditionActions', "
                          "[OrderedDict([('actionName', '%s')])])])}"
                          % action.action_name)

    def test_query_goal(self):
        client = Client(schema)
        action_goal = self.rc_action_goals[0]
        action_goal.description = "tori"
        action_goal.save()
        executed = client.execute('''
                                    query {
                                        roadConditionActionGoals
                                        (
                                            name: "%s",
                                            desc: "%s",
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (action_goal.name,
                                           action_goal.description))
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('roadConditionActionGoals', "
                          "[OrderedDict([('name', '%s')])])])}"
                          % action_goal.name)

    def test_query_goal_id(self):
        client = Client(schema)
        action_goal = self.rc_action_goals[0]
        executed = client.execute('''
                                    query {
                                        roadConditionActionGoals
                                        (
                                            goalId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % action_goal.id)
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('roadConditionActionGoals', "
                          "[OrderedDict([('name', '%s')])])])}"
                          % action_goal.name)

    def test_query_constraint(self):
        client = Client(schema)
        constraint = self.constraints[0]
        executed = client.execute('''
                                    query {
                                        roadConditionActionConstraints
                                        (
                                            typeId: %s,
                                            name: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (constraint.constraint_type.id,
                                           constraint.name))
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([("
                          "'roadConditionActionConstraints', "
                          "[OrderedDict([('name', '%s')])])])}"
                          % constraint.name)

    def test_query_constraint_id(self):
        client = Client(schema)
        constraint = self.constraints[0]
        executed = client.execute('''
                                    query {
                                        roadConditionActionConstraints
                                        (
                                            constraintId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % constraint.id)
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([("
                          "'roadConditionActionConstraints', "
                          "[OrderedDict([('name', '%s')])])])}"
                          % constraint.name)

    def test_query_constraint(self):
        client = Client(schema)
        constraint_type = self.constraint_types[0]
        constraint_type.description = "boomerang"
        constraint_type.save()
        executed = client.execute('''
                                    query {
                                        roadConditionActionConstraintTypes
                                        (
                                            name: "%s",
                                            desc: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (constraint_type.name,
                                           constraint_type.description))
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([("
                          "'roadConditionActionConstraintTypes', "
                          "[OrderedDict([('name', '%s')])])])}"
                          % constraint_type.name)

    def test_query_constraint_id(self):
        client = Client(schema)
        constraint_type = self.constraint_types[0]
        executed = client.execute('''
                                    query {
                                        roadConditionActionConstraintTypes
                                        (
                                            typeId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % constraint_type.id)
        """
        TODO: Get the folder objects instead of a string
        """
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([("
                          "'roadConditionActionConstraintTypes', "
                          "[OrderedDict([('name', '%s')])])])}"
                          % constraint_type.name)

    def test_create_correct(self):
        client = Client(schema)
        name = 'Test-Name'
        condition = self.conditions[0]
        system = self.instrument_systems[0]
        goal = self.rc_action_goals[0]
        action = self.instrument_actions[0]
        types = self.constraint_types[0]
        executed = client.execute('''
                                    mutation {
                                        createRoadConditionAction
                                        (
                                            actionName: "%s",
                                            roadConditionId: %s,
                                            instrumentSystemId: %s,
                                            roadConditionActionGoalId: %s,
                                            constraint: {
                                                name: "AAA",
                                                type: %s
                                            }
                                            instrumentActionIds: [%s]
                                        )
                                        {
                                            actionName
                                        }
                                    }
                                    ''' % (
            name, condition.id, system.id, goal.id, types.id, action.id))
        self.maxDiff = None
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('createRoadConditionAction',"
                          " OrderedDict([('actionName', '%s')]))])}" % name)

    def test_update(self):
        client = Client(schema)
        action = self.rc_actions[0]
        new_des = 'New-Desc'
        executed = client.execute('''
                                    mutation {
                                        updateRoadConditionAction
                                        (
                                            id: %s,
                                            description: "%s"
                                        )
                                        {
                                            description
                                        }
                                    }
                                    ''' % (action.id, new_des))
        self.assertEquals(
            str(executed),
            "{'data': OrderedDict([('updateRoadConditionAction', "
            "OrderedDict([('description', '%s')]))])}" % new_des)

    def test_update_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateRoadConditionAction
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Roadconditionaction with id = -99 does not exist!")

    def test_delete(self):
        client = Client(schema)
        action = self.rc_actions[1]
        executed = client.execute('''
                                    mutation {
                                        deleteRoadConditionAction
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % action.id)
        self.assertEquals(
            str(executed),
            "{'data': OrderedDict([('deleteRoadConditionAction', None)])}")

    def test_delete_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteRoadConditionAction
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Roadconditionaction with id = -99 does not exist!")
