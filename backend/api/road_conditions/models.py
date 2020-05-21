from django.db import models

from .road_condition_actions.models import RoadConditionAction
from ..abstract_model import *


# Create your models here.
class RoadConditionType(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    img = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)


class RoadCondition(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    road_condition_type = models.ForeignKey(
        RoadConditionType,
        db_column="road_condition_type_id",
        related_name="road_condition_enum",
        on_delete=models.DO_NOTHING,
    )
    road_conditions = models.ManyToManyField(
        "self",
        through="RoadConditionToRoadCondition",
        related_name="road_conditions_road_conditions",
        symmetrical=False,
    )
    road_condition_actions = models.ManyToManyField(
        RoadConditionAction,
        related_name="road_condition_road_condition_actions",
        through="RoadConditionToRoadConditionAction",
    )


class RoadConditionToRoadCondition(AbstractModel):
    id = models.AutoField(primary_key=True)
    from_road_condition = models.ForeignKey(
        RoadCondition,
        related_name="from_road_condition",
        db_column="road_condition_from_id",
        on_delete=models.DO_NOTHING,
    )
    to_road_condition = models.ForeignKey(
        RoadCondition,
        related_name="to_road_condition",
        db_column="road_condition_to_id",
        on_delete=models.DO_NOTHING,
    )


class RoadConditionToRoadConditionAction(AbstractModel):
    road_condition = models.ForeignKey(
        RoadCondition,
        db_column="road_condition_id",
        related_name="rcrca_road_condition",
        on_delete=models.DO_NOTHING,
    )
    road_condition_action = models.ForeignKey(
        RoadConditionAction,
        db_column="road_condition_action_id",
        related_name="rcrca_road_condition_action",
        on_delete=models.DO_NOTHING,
    )


class RoadConditionDate(AbstractModel):
    road_condition = models.OneToOneField(
        RoadCondition,
        db_column="road_condition_id",
        related_name="road_condition_date",
        on_delete=models.DO_NOTHING,
    )
    start_cron = models.TextField()
    end_cron = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    end_repeat_date = models.TextField()
