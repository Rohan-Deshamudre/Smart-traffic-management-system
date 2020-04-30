from django.db import models

# Create your models here.
from api.abstract_model import AbstractModel
from ndw.database.location.model import Location


class MeasurementSite(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    version = models.IntegerField()
    location = models.ForeignKey(Location, db_column='location_id',
                                 related_name='location',
                                 on_delete=models.SET_NULL, null=True)


class MeasurementSiteIndex(AbstractModel):
    id = models.AutoField(primary_key=True)
    measurement_site = models.ForeignKey(MeasurementSite,
                                         db_column='measurement_site_id',
                                         related_name='indices',
                                         on_delete=models.CASCADE)
    index = models.IntegerField()
    index_name = models.CharField(max_length=255)
