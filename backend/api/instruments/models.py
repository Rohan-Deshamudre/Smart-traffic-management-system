from django.db import models

from api.folders.models import Folder
from api.labels.models import Label
from ..abstract_model import *


# Create your models here.
class InstrumentType(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    img = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)


class InstrumentSystem(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)


class Instrument(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    instrument_type = models.ForeignKey(InstrumentType,
                                        db_column="instrument_type_id",
                                        related_name='instrument_enum',
                                        on_delete=models.DO_NOTHING)
    lat = models.DecimalField(max_digits=11, decimal_places=8)
    lng = models.DecimalField(max_digits=11, decimal_places=8)
    instrument_system = \
        models.ForeignKey(InstrumentSystem, null=True,
                          db_column="instrument_system_id",
                          related_name='instrument_system_enum',
                          on_delete=models.DO_NOTHING)

    labels = models.ManyToManyField(Label, related_name='instrument_labels',
                                    through='InstrumentToLabel')
    description = models.TextField(blank=True, null=True)


class InstrumentToLabel(AbstractModel):
    id = models.AutoField(primary_key=True)
    instrument = models.ForeignKey(Instrument, related_name="instrument_label",
                                   db_column="instrument_id",
                                   on_delete=models.DO_NOTHING)
    label = models.ForeignKey(Label, related_name="label_instrument",
                              db_column="label_id",
                              on_delete=models.DO_NOTHING)
