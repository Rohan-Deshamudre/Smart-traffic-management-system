from django.db import models
from ..abstract_model import *


# Create your models here.
class Route(AbstractModel):
    id = models.AutoField(primary_key=True)


class RouteSegment(AbstractModel):
    route = models.ForeignKey(Route, db_column="route_id",
                              related_name='route_points',
                              on_delete=models.DO_NOTHING)
    segment = models.IntegerField()
    lat = models.DecimalField(max_digits=11, decimal_places=8)
    lng = models.DecimalField(max_digits=11, decimal_places=8)
