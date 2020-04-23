from api.exception.api_exception import ObjectNotFoundException
from api.road_conditions.road_condition_actions.models import \
    RoadConditionAction
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.models import \
    RoadConditionActionConstraintType, RoadConditionActionConstraint


def has_constraint_type(type_id: int) -> bool:
    return RoadConditionActionConstraintType.objects.filter(
        id=type_id).exists()


def get_constraint_type(type_id: int) -> RoadConditionActionConstraintType:
    if has_constraint_type(type_id):
        return RoadConditionActionConstraintType.objects.get(id=type_id)
    raise ObjectNotFoundException('RoadConditionActionConstraintType', 'id',
                                  type_id)


def create_road_condition_action_constraint(
        constraint: RoadConstraintInputObject) -> \
        RoadConditionActionConstraint:
    c = RoadConditionActionConstraint(name='', constraint_type_id=1)
    if constraint is not None:
        c = RoadConditionActionConstraint(name=constraint.name,
                                          constraint_type=get_constraint_type(
                                              constraint.type))
    c.save()
    return c


def update_road_condition_constraint(rca: RoadConditionAction,
                                     constraint: RoadConstraintInputObject):
    if rca.constraint and rca.constraint.name == constraint.name:
        return

    new_constraint = create_road_condition_action_constraint(constraint)
    rca.constraint = new_constraint
