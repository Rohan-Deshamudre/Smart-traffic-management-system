from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException
from api.road_conditions.road_condition_actions.methods.getter import \
    get_road_condition_action_by_id
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.methods import \
    get_constraint_type, \
    update_road_condition_constraint
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.models import \
    RoadConditionActionConstraintType, RoadConditionActionConstraint
from tests.api.instruments.instrument_actions.methods import \
    create_instrument_actions
from tests.api.instruments.methods import create_instrument_types, \
    create_instruments, create_instrument_systems
from tests.api.road_conditions.road_condition_actions.methods import \
    create_road_condition_action_goals, \
    create_road_condition_actions


class RoadConditionActionConstraintMethodsTest(TestCase):
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

    def test_get_constraint_type_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_constraint_type(-1)

    def test_update_constraint(self):
        rc_action = self.rc_actions[0]
        constraint_type = RoadConditionActionConstraintType(name="boomerang")
        constraint_type.save()
        constraint = RoadConditionActionConstraint(
            name="tori", constraint_type=constraint_type)
        constraint.save()
        rc_action.constraint = constraint
        rc_action.save()
        new_constraint = RoadConstraintInputObject()
        new_constraint.name = "tori"
        new_constraint.type = constraint_type.id
        update_road_condition_constraint(rc_action, new_constraint)
        updated_rc_action = get_road_condition_action_by_id(rc_action.id)
        self.assertEqual(updated_rc_action.constraint, rc_action.constraint)
