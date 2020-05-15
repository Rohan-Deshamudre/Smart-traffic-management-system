from api.instruments.instrument_actions.compression import \
    import_instrument_action, to_json_instrument_action
from api.road_conditions.road_condition_actions.methods.create import \
    create_road_condition_action
from api.road_conditions.road_condition_actions.models import \
    RoadConditionAction
from api.road_conditions.road_condition_actions.road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions.road_condition_action_constraint.models import \
    RoadConditionActionConstraint

goal_type_key = 'goal_type'
instrument_system_key = 'instrument_system'
action_name_key = 'action_name'
constraint_key = 'constraint'
description_key = 'description'
instrument_actions_key = 'instrument_actions'

keys = [goal_type_key, instrument_system_key, action_name_key, constraint_key,
        description_key, instrument_actions_key]

constraint_name_key = 'name'
constraint_type_key = 'type'

c_keys = [constraint_name_key, constraint_type_key]


def to_json_constraint(constraint: RoadConditionActionConstraint):
    if constraint:
        constraint_object = {
            constraint_name_key: constraint.name,
            constraint_type_key: constraint.constraint_type.id
        }
        return constraint_object
    return {}


def to_json_road_condition_action(road_condition_action: RoadConditionAction):
    road_condition_action_object = {
        goal_type_key: road_condition_action.road_condition_action_goal.id,
        instrument_system_key: road_condition_action.instrument_system.id,
        action_name_key: road_condition_action.action_name,
        constraint_key: to_json_constraint(road_condition_action.constraint),
        description_key: road_condition_action.description}

    instrument_action_array = []

    for ia in road_condition_action.instrument_actions.all():
        instrument_action_array.append(to_json_instrument_action(ia))

    road_condition_action_object[
        instrument_actions_key] = instrument_action_array

    return road_condition_action_object


def get_road_condition_constraint_input(
        constraint_object) -> RoadConstraintInputObject:
    if constraint_object is not None and all((w in constraint_object for w in
                                              c_keys)):
        constraint_input = RoadConstraintInputObject()
        constraint_input.name = constraint_object[constraint_name_key]
        constraint_input.type = constraint_object[constraint_type_key]
        return constraint_input
    return None


def import_road_condition_action(json_object, road_condition_id):
    if all((w in json_object for w in keys)):
        road_condition_action_goal_id = json_object[goal_type_key]
        instrument_system_id = json_object[instrument_system_key]
        action_name = json_object[action_name_key]
        constraint = get_road_condition_constraint_input(json_object[
            constraint_key])
        description = json_object[description_key]
        road_condition_action = \
            create_road_condition_action(road_condition_id,
                                         instrument_system_id,
                                         action_name,
                                         road_condition_action_goal_id,
                                         constraint,
                                         description, [],
                                         True)
        for ia in json_object[instrument_actions_key]:
            import_instrument_action(ia, road_condition_action.id)
