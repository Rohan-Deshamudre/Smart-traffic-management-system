"""
The Response Plan model is defined here.
"""

from django.db import models
from ..abstract_model import *
from ..road_segments.models import RoadSegment
from ..road_conditions.models import RoadCondition
from ..scenarios.models import Scenario


class ResponsePlan(AbstractModel):
    id = models.AutoField(primary_key=True)
    road_segment = models.ForeignKey(RoadSegment,
                                     db_column="road_segment_id",
                                     related_name="road_segment",
                                     on_delete=models.DO_NOTHING,
                                     blank=True,
                                     null=True)
    operator = models.CharField(max_length=16)
    road_condition = models.ForeignKey(RoadCondition,
                                       db_column="road_condition_id",
                                       related_name="road_condition",
                                       on_delete=models.DO_NOTHING,
                                       blank=True,
                                       null=True)
    scenario = models.ForeignKey(Scenario,
                                 db_column="scenario_id",
                                 related_name="scenario",
                                 on_delete=models.DO_NOTHING,
                                 blank=True,
                                 null=True)
    parent = models.ForeignKey('self',
                               db_column="parent_id",
                               related_name="response_plans",
                               on_delete=models.DO_NOTHING,
                               blank=True,
                               null=True)
