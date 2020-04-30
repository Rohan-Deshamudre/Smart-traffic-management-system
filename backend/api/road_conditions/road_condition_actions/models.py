from django.db import models
from api.abstract_model import *
from api.instruments.instrument_actions.models import InstrumentAction
from api.instruments.models import InstrumentSystem
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.models import \
    RoadConditionActionConstraint


class RoadConditionActionGoal(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    img = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)


class RoadConditionAction(AbstractModel):
    id = models.AutoField(primary_key=True)
    road_condition_action_goal = \
        models.ForeignKey(
            RoadConditionActionGoal,
            db_column="road_condition_action_goal_id",
            related_name="road_condition_action_instrument_action",
            on_delete=models.DO_NOTHING)
    instrument_system = \
        models.ForeignKey(
            InstrumentSystem,
            db_column="instrument_system_id",
            related_name="road_condition_action_instrument_system",
            on_delete=models.DO_NOTHING)
    action_name = models.TextField(blank=True, null=True)
    constraint = models.ForeignKey(RoadConditionActionConstraint,
                                   db_column="constraint_id",
                                   related_name="road_condition_constraint",
                                   on_delete=models.DO_NOTHING, null=True)
    description = models.TextField(blank=True, null=True)
    instrument_actions = \
        models.ManyToManyField(
            InstrumentAction,
            related_name="road_condition_action_instrument_action",
            through="RoadConditionActionToInstrumentAction")


class RoadConditionActionToInstrumentAction(AbstractModel):
    id = models.AutoField(primary_key=True)
    road_condition_action = \
        models.ForeignKey(
            RoadConditionAction,
            db_column="road_condition_action_id",
            related_name="rcaia_road_condition_action",
            on_delete=models.DO_NOTHING)
    instrument_action = \
        models.ForeignKey(InstrumentAction,
                          db_column="instrument_action_id",
                          related_name="rcaia_instrument_action",
                          on_delete=models.DO_NOTHING)
