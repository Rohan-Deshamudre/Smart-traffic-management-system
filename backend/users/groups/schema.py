from django.contrib.auth.models import Group

import graphene
from graphene_django import DjangoObjectType

class GroupType(DjangoObjectType):
    class Meta:
        model = Group
