from django.db import models

from api.folders.models import Folder
from api.labels.models import Label
from ..abstract_model import *


# Create your models here.
class Scenario(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_lat = models.DecimalField(max_digits=11, decimal_places=8)
    start_lng = models.DecimalField(max_digits=11, decimal_places=8)
    end_lat = models.DecimalField(max_digits=11, decimal_places=8)
    end_lng = models.DecimalField(max_digits=11, decimal_places=8)
    response_plan_active = models.BooleanField(null=True, default=False)
    insights = models.TextField(blank=True, null=True)
    labels = models.ManyToManyField(Label, related_name='scenario_labels',
                                    through='ScenarioToLabel')
    folder = models.ForeignKey(Folder, db_column="folder_id",
                               related_name="scenarios",
                               blank=True, null=True,
                               on_delete=models.DO_NOTHING)


class ScenarioToLabel(AbstractModel):
    id = models.AutoField(primary_key=True)
    scenario = models.ForeignKey(Scenario, related_name="scenario_label",
                                 db_column="scenario_id",
                                 on_delete=models.DO_NOTHING)
    label = models.ForeignKey(Label, related_name="label_scenario",
                              db_column="label_id",
                              on_delete=models.DO_NOTHING)
