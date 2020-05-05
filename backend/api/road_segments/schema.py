import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.road_segments.methods.create import create_road_segment
from api.road_segments.methods.delete import delete_road_segment
from api.road_segments.methods.update import update_road_segment
from api.routes.input_object import RouteInputObject
from .models import *
from ..road_conditions.methods.getter import get_road_condition_parents

from utils.auth import has_perms


class RoadSegmentObjectType(DjangoObjectType):
    class Meta:
        model = RoadSegment
        exclude_fields = ('scenario', 'fk_simulationSceneEvent_roadSegment')


class RoadSegmentTypeObjectType(DjangoObjectType):
    class Meta:
        model = RoadSegmentType
        exclude_fields = ('road_segment_enum',)


class Query(graphene.ObjectType):
    road_segments = graphene.List(RoadSegmentObjectType,
                                  segment_id=graphene.Int(),
                                  condition_id=graphene.Int())
    road_segment_types = graphene.List(RoadSegmentTypeObjectType,
                                       type_id=graphene.Int(),
                                       name=graphene.String(),
                                       desc=graphene.String())

    def resolve_road_segments(self, info, segment_id=None, condition_id=None):
        """
        Queries road_segments from the database
        :param info:
        :param segment_id: The segment ID to filter on
        :param condition_id: The condition ID to filter on
        :return: All (filtered) road_segments
        """
        #has_perms(info.context.user, ['road_segments.view_roadsegment'])
        res = RoadSegment.objects.all()

        if segment_id:
            res = res.filter(Q(id__exact=segment_id))
        if condition_id:
            rc = RoadCondition.objects.filter(id__exact=condition_id).first()
            if rc is None:
                return []
            elif len(get_road_condition_parents(rc)) > 0:
                rc = get_road_condition_parents(rc)[-1]
            res = res.filter(Q(road_conditions=rc))
        return res

    def resolve_road_segment_types(self, info, type_id=None, name=None,
                                   desc=None, **kwargs):
        """
        Queries road_segment_types from the database
        :param info:
        :param type_id: The type ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param kwargs:
        :return: All (filtered) road_segment_types
        """
        #has_perms(info.context.user, ['road_segments.view_roadsegmenttype'])
        res = RoadSegmentType.objects.all()
        if type_id:
            res = res.filter(Q(id__exact=type_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res


class CreateRoadSegment(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    scenario_id = graphene.Int()
    route_id = graphene.Int()
    road_segment_type = graphene.Int()

    class Arguments:
        name = graphene.String(required=True)
        scenario_id = graphene.Int(required=True)
        road_segment_type_id = graphene.Int(required=True)
        route = RouteInputObject

    def mutate(self, info, name, scenario_id, road_segment_type_id, route):
        #has_perms(info.context.user, ['road_segments.add_roadsegment'])
        try:
            road_segment = create_road_segment(name, scenario_id,
                                               road_segment_type_id, route)
            return CreateRoadSegment(
                id=road_segment.id,
                name=road_segment.name,
                scenario_id=road_segment.scenario.id,
                road_segment_type=road_segment.road_segment_type.id,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateRoadSegment(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    scenario_id = graphene.Int()
    route_id = graphene.Int()
    road_segment_type = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        scenario_id = graphene.Int()
        road_segment_type_id = graphene.Int()
        route = RouteInputObject

    def mutate(self, info, id, name=None, scenario_id=None,
               road_segment_type_id=None, route=None):
        #has_perms(info.context.user, ['road_segments.change_roadsegment'])
        try:
            road_segment = update_road_segment(id, name, scenario_id,
                                               road_segment_type_id, route)
            return UpdateRoadSegment(
                id=road_segment.id,
                name=road_segment.name,
                scenario_id=road_segment.scenario.id,
                road_segment_type=road_segment.road_segment_type.id,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteRoadSegment(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        """
        Deletes the road_segment
        :param info:
        :param id: The ID of the road_segment
        :return:
        """
        #has_perms(info.context.user, ['road_segments.delete_roadsegment'])
        try:
            delete_road_segment(id)
        except ApiException as exc:
            GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_road_segment = CreateRoadSegment.Field()
    update_road_segment = UpdateRoadSegment.Field()
    delete_road_segment = DeleteRoadSegment.Field()
