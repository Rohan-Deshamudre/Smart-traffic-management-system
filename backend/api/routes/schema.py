import graphene
from graphene_django import DjangoObjectType
from .models import *

from utils.auth import has_perms


class RouteObjectType(DjangoObjectType):
    class Meta:
        model = Route

    # exclude_fields = (
    #     "routes",
    #     "road_segment_route",
    # )


class RouteSegmentObjectType(DjangoObjectType):
    class Meta:
        model = RouteSegment

    # exclude_fields = ("route",)


class Query(graphene.ObjectType):
    routes = graphene.List(RouteObjectType)

    def resolve_routes(self, info, **kwargs):
        has_perms(info, ["routes.view_route"])
        return Route.objects.all()


class Mutation(graphene.ObjectType):
    pass
