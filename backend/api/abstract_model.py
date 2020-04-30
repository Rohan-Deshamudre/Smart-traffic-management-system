from django.db.models import Model
from django.db.models.base import ModelBase
import re


class AbstractModelBase(ModelBase):
    def __new__(cls, name, bases, attrs, **kwargs):
        if name != "AbstractModel":
            class MetaB:
                db_table = convert(name)

            attrs["Meta"] = MetaB

        r = super().__new__(cls, name, bases, attrs, **kwargs)
        return r


class AbstractModel(Model, metaclass=AbstractModelBase):
    class Meta:
        abstract = True


def convert(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()
