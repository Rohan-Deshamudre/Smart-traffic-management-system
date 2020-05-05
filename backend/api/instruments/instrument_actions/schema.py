"""
Functions for querying and mutating instrument_actions
"""
import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.instruments.instrument_actions.methods.create import \
    create_instrument_action
from api.instruments.instrument_actions.methods.delete import \
    delete_instrument_action
from api.instruments.instrument_actions.methods.getter import \
    get_all_instrument_actions
from api.instruments.instrument_actions.methods.update import \
    update_instrument_action
from api.road_conditions.road_condition_actions.models import \
    RoadConditionAction
from api.routes.input_object import RouteInputObject
from .models import *
from ...road_conditions.models import RoadCondition
from ...road_segments.models import RoadSegment

from utils.auth import has_perms


class InstrumentActionObjectType(DjangoObjectType):
    class Meta:
        model = InstrumentAction
        exclude_fields = ('road_condition_instrument_actions',
                          'road_condition_action_instrument_action',
                          ' instrument_action_to_route_ia',)


class Query(graphene.ObjectType):
    instrument_actions = graphene.List(InstrumentActionObjectType,
                                       instrument_action_id=graphene.Int(),
                                       instrument_id=graphene.Int(),
                                       desc=graphene.String(),
                                       scenario_id=graphene.Int(),
                                       condition_id=graphene.Int())

    def resolve_instrument_actions(self, info, instrument_action_id=None,
                                   instrument_id=None, desc=None,
                                   scenario_id=None, condition_id=None,
                                   **kwargs):
        """
        Queries instrument_actions from the database
        :param info:
        :param instrument_action_id: The instrument_action ID to filter on
        :param instrument_id: The instrument ID to filter on
        :param desc: The (part of the) description to filter on
        :param scenario_id: The scenario ID to filter on
        :param kwargs:
        :return: All (filtered) instrument_actions
        """
        has_perms(info.context.user, ['instruments.view_instrumentaction'])
        res = get_all_instrument_actions()
        if condition_id:
            rca = RoadConditionAction.objects.filter(
                road_condition_road_condition_actions__id=condition_id).all()
            res = res.filter(Q(
                road_condition_action_instrument_action__in=rca)) \
                .distinct().all()
        if scenario_id:
            rs = RoadSegment.objects.filter(scenario__id=scenario_id).all()
            rc = RoadCondition.objects.filter(
                road_segment_road_condition__in=rs).all()
            rca = RoadConditionAction.objects.filter(
                road_condition_road_condition_actions__in=rc).all()
            res = res.filter(Q(
                road_condition_action_instrument_action__in=rca)) \
                .distinct().all()
        if instrument_action_id:
            res = res.filter(Q(id__exact=instrument_action_id))
        if instrument_id:
            res = res.filter(Q(instrument_id=instrument_id))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res


class CreateInstrumentAction(graphene.Mutation):
    """
    Creates an instrument action.
    """
    id = graphene.Int()
    instrument_id = graphene.Int()
    text = graphene.String()
    description = graphene.String()

    class Arguments:
        instrument_id = graphene.Int(required=True)
        text = graphene.String(required=True)
        description = graphene.String()
        routes = graphene.List(RouteInputObject)

    def mutate(self, info, instrument_id, text, description="", routes=None):
        has_perms(info.context.user, ['instruments.add_instrumentaction'])
        try:
            instrument_action = create_instrument_action(instrument_id, text,
                                                         description, routes)
            return CreateInstrumentAction(
                id=instrument_action.id,
                instrument_id=instrument_action.instrument.id,
                text=instrument_action.text,
                description=instrument_action.description
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateInstrumentAction(graphene.Mutation):
    id = graphene.Int()
    instrument_id = graphene.Int()
    text = graphene.String()
    description = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)
        instrument_id = graphene.Int()
        text = graphene.String()
        description = graphene.String()
        routes = graphene.List(RouteInputObject)

    def mutate(self, info, id, instrument_id=None, text=None, description=None,
               routes=None):
        has_perms(info.context.user, ['instruments.change_instrumentaction'])
        try:
            instrument_action = update_instrument_action(id, instrument_id,
                                                         text, description,
                                                         routes)

            return UpdateInstrumentAction(
                id=instrument_action.id,
                instrument_id=instrument_action.instrument.id,
                text=instrument_action.text,
                description=instrument_action.description,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteInstrumentAction(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id, **kwargs):
        """
        Deletes the instrument_action, and the links to the
        routes and road_condition_actions
        :param info:
        :param id: The ID of the instrument_action
        :param kwargs:
        :return:
        """
        has_perms(info.context.user, ['instruments.delete_instrumentaction'])
        try:
            delete_instrument_action(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_instrument_action = CreateInstrumentAction.Field()
    update_instrument_action = UpdateInstrumentAction.Field()
    delete_instrument_action = DeleteInstrumentAction.Field()
