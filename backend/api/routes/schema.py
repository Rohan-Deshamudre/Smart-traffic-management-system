import graphene
from graphene_django import DjangoObjectType
from .models import *


class RouteObjectType(DjangoObjectType):
    class Meta:
        model = Route
        exclude_fields = ('routes', 'road_segment_route',)


class RouteSegmentObjectType(DjangoObjectType):
    class Meta:
        model = RouteSegment
        exclude_fields = ('route',)


class Query(graphene.ObjectType):

    def resolve_routes(self, info, **kwargs):
        return Route.objects.all()
