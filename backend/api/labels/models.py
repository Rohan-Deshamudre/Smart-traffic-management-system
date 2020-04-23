"""
The folder model is defined here.
"""

from django.db import models
from ..abstract_model import *


# Create your models here.
class Label(AbstractModel):
    id = models.AutoField(primary_key=True)
    unique_label = models.CharField(max_length=255, unique=True)
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
