"""
All instrument_action related models are defined here.
"""

from django.db import models
from api.abstract_model import *
from api.instruments.models import Instrument
from api.routes.models import Route


# Create your models here.

class InstrumentAction(AbstractModel):
    id = models.AutoField(primary_key=True)
    instrument = models.ForeignKey(Instrument, db_column="instrument_id",
                                   related_name='instrument_actions',
                                   on_delete=models.DO_NOTHING)
    text = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    routes = models.ManyToManyField(Route, related_name='routes',
                                    through='InstrumentActionToRoute')


class InstrumentActionToRoute(AbstractModel):
    instrument_action = \
        models.ForeignKey(InstrumentAction,
                          db_column="instrument_action_id",
                          related_name='instrument_action_to_route_ia',
                          on_delete=models.DO_NOTHING)
    route = models.ForeignKey(Route, db_column="route_id",
                              on_delete=models.CASCADE)
