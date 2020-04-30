"""
The folder model is defined here.
"""

from django.db import models
from ..abstract_model import *


# Create your models here.
class FolderType(AbstractModel):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)


class Folder(AbstractModel):
    id = models.AutoField(primary_key=True)
    parent = models.ForeignKey('self', db_column="parent_id",
                               related_name="folders",
                               on_delete=models.DO_NOTHING,
                               blank=True, null=True)
    folder_type = models.ForeignKey(FolderType, db_column="folder_type_id",
                                    related_name="folder_type",
                                    on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
