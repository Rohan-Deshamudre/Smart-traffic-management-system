from django.db import models
from ..abstract_model import *
from ..scenarios.models import Scenario
from ..routes.models import Route
from ..road_conditions.models import RoadCondition


# Create your models here.
class RoadSegmentType(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    img = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)


class RoadSegment(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    scenario = models.ForeignKey(
        Scenario,
        db_column="scenario_id",
        related_name="road_segments",
        on_delete=models.DO_NOTHING,
    )
    route = models.ForeignKey(
        Route,
        db_column="route_id",
        related_name="road_segment_route",
        null=True,
        on_delete=models.SET_NULL,
    )
    road_segment_type = models.ForeignKey(
        RoadSegmentType,
        db_column="road_segment_type_id",
        related_name="road_segment_enum",
        on_delete=models.DO_NOTHING,
    )
    road_conditions = models.ManyToManyField(
        RoadCondition,
        related_name="road_segment_road_condition",
        through="RoadSegmentToRoadCondition",
    )


class RoadSegmentToRoadCondition(AbstractModel):
    road_segment = models.ForeignKey(
        RoadSegment, db_column="road_segment_id", on_delete=models.DO_NOTHING
    )
    road_condition = models.ForeignKey(
        RoadCondition, db_column="road_condition_id", on_delete=models.DO_NOTHING
    )
