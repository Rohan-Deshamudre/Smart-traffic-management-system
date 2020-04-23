from django.db import models

# Create your models here.
from api.abstract_model import AbstractModel


class Location(AbstractModel):
    id = models.AutoField(primary_key=True)


class Point(AbstractModel):
    id = models.AutoField(primary_key=True)
    location = models.ForeignKey(Location, db_column='location_id',
                                 related_name='points',
                                 on_delete=models.CASCADE)
    index = models.IntegerField()
    lat = models.DecimalField(max_digits=11, decimal_places=8)
    lng = models.DecimalField(max_digits=11, decimal_places=8)
