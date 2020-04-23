from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException, \
    ConstraintException
from api.road_conditions.road_condition_actions.methods.create import \
    create_road_condition_action
from api.road_conditions.road_condition_actions.methods.delete import \
    delete_road_condition_action
from api.road_conditions.road_condition_actions.methods.getter import \
    get_road_condition_action_goal_by_id, \
    has_road_condition_action_goal_with_id, get_road_condition_action_by_id, \
    has_road_condition_action_with_id
from api.road_conditions.road_condition_actions.methods.update import \
    replace_instrument_action, \
    update_road_condition_action_name, update_road_condition_action
from api.road_conditions.road_condition_actions.models import \
    RoadConditionActionToInstrumentAction
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.models import \
    RoadConditionActionConstraintType
from tests.api.instruments.instrument_actions.methods import \
    create_instrument_actions
from tests.api.instruments.methods import create_instrument_types, \
    create_instruments, create_instrument_systems
from tests.api.road_conditions.methods import create_road_condition_types, \
    create_road_conditions, create_rc_to_rca
from tests.api.road_conditions.road_condition_actions.methods import \
    create_road_condition_action_goals, \
    create_road_condition_actions, create_rca_to_ia, create_constraint_types


class RoadConditionActionMethodsTest(TestCase):
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
        self.constraint_types = create_constraint_types(['Test-1', 'Test-2'])
        create_rc_to_rca(self.conditions, self.rc_actions)

    def test_has_and_get_action_goal(self):
        action_goal = self.rc_action_goals[0]
        getter_action_goal = get_road_condition_action_goal_by_id(
            action_goal.id)
        self.assertEqual(action_goal, getter_action_goal)
        self.assertTrue(has_road_condition_action_goal_with_id(action_goal.id))

    def test_has_and_get_action(self):
        action = self.rc_actions[0]
        getter_action = get_road_condition_action_by_id(action.id)
        self.assertEqual(action, getter_action)
        self.assertTrue(has_road_condition_action_with_id(action.id))

    def test_get_action_goal_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_condition_action_goal_by_id(-1)

    def test_get_action_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_road_condition_action_by_id(-1)

    def test_action_creation(self):
        condition = self.conditions[0]
        system = self.instrument_systems[0]
        goal = self.rc_action_goals[0]
        instrument_action = self.instrument_actions[0]
        constraint_type = RoadConditionActionConstraintType(id=1,
                                                            name="boomerang")
        constraint_type.save()
        action = create_road_condition_action(condition.id, system.id,
                                              "Test-Name",
                                              goal.id, None, "",
                                              [instrument_action.id])
        created_action = get_road_condition_action_by_id(action.id)
        self.assertEqual(action, created_action)

    def test_repace_instrument_action(self):
        action = self.rc_actions[0]
        instrument_action = self.instrument_actions[1]
        replace_instrument_action(action, [instrument_action.id])
        rcatia = RoadConditionActionToInstrumentAction.objects.first()
        updated_instrument_action = rcatia.instrument_action
        self.assertEqual(instrument_action, updated_instrument_action)

    def test_update_name(self):
        action = self.rc_actions[1]
        new_name = "Test-Name"
        update_road_condition_action_name(action, new_name)
        self.assertEqual(action.action_name, new_name)

    def test_update_name_exception(self):
        action = self.rc_actions[2]
        new_name = "Test-RCA-2"
        with self.assertRaises(ConstraintException):
            update_road_condition_action_name(action, new_name)

    def test_update_action(self):
        action = self.rc_actions[0]
        new_system = self.instrument_systems[1]
        new_name = "New-Name"
        new_goal = self.rc_action_goals[1]
        new_constraint = RoadConstraintInputObject()
        new_constraint.name = "new const"
        new_constraint.type = self.constraint_types[0].id
        new_description = "New-Description"
        new_instrument_action = self.instrument_actions[1]
        new_action = update_road_condition_action(action.id, new_system.id,
                                                  new_name, new_goal.id,
                                                  new_constraint,
                                                  new_description,
                                                  [new_instrument_action.id])
        rcatia = RoadConditionActionToInstrumentAction.objects.first()
        updated_instrument_action = rcatia.instrument_action
        self.assertEqual(new_action.instrument_system, new_system)
        self.assertEqual(new_action.action_name, new_name)
        self.assertEqual(new_action.road_condition_action_goal, new_goal)
        self.assertEqual(new_action.constraint.constraint_type,
                         self.constraint_types[0])
        self.assertEqual(new_action.description, new_description)
        self.assertEqual(new_instrument_action, updated_instrument_action)

    def test_delete(self):
        action_id = self.rc_actions[0].id
        delete_road_condition_action(action_id)
        self.assertFalse(has_road_condition_action_with_id(action_id))
