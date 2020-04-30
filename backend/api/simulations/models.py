from django.db import models

from api.road_conditions.models import RoadConditionType
from api.road_segments.models import RoadSegment
from ..abstract_model import *


# Create your models here.
class Simulation(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)


class SimulationScene(AbstractModel):
    id = models.AutoField(primary_key=True)
    simulation = models.ForeignKey(Simulation, db_column="simulation_id",
                                   related_name='simulation_scenes',
                                   on_delete=models.DO_NOTHING)
    time = models.DateTimeField()


key = 'fk_simulationSceneEvent_roadConditionType'


class SimulationSceneEvent(AbstractModel):
    id = models.AutoField(primary_key=True)
    simulation_scene = \
        models.ForeignKey(SimulationScene,
                          db_column="simulation_scene_id",
                          related_name='simulation_scene_events',
                          on_delete=models.DO_NOTHING)
    road_segment = \
        models.ForeignKey(RoadSegment, db_column="road_segment_id",
                          related_name='fk_simulationSceneEvent_roadSegment',
                          on_delete=models.DO_NOTHING)
    road_condition_type = \
        models.ForeignKey(RoadConditionType,
                          db_column="road_condition_type_id",
                          related_name=key,
                          on_delete=models.DO_NOTHING)
    value = models.IntegerField()
