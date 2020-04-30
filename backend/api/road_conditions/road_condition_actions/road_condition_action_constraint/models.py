from django.db import models
from api.abstract_model import AbstractModel


class RoadConditionActionConstraintType(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    img = models.TextField(blank=True, null=False)
    description = models.TextField(blank=True, null=False)


class RoadConditionActionConstraint(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.TextField(blank=True, null=False)
    constraint_type = models.ForeignKey(RoadConditionActionConstraintType,
                                        db_column="constraint_type_id",
                                        related_name="rcac_rcact",
                                        on_delete=models.DO_NOTHING)
