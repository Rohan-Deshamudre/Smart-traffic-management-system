import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from django.db.models import Q

from api.exception.api_exception import ApiException
from api.instruments.instrument_actions.models import InstrumentAction
from api.instruments.methods.create import create_instrument
from api.instruments.methods.delete import delete_instrument
from api.instruments.methods.update import update_instrument
from api.labels.input_object import LabelArrayInputObject

from .models import *
from .instrument_actions import schema as action_schema
from ..road_conditions.models import RoadCondition
from ..road_conditions.road_condition_actions.models import RoadConditionAction
from ..road_segments.models import RoadSegment


class InstrumentObjectType(DjangoObjectType):
    class Meta:
        model = Instrument


class InstrumentTypeObjectType(DjangoObjectType):
    class Meta:
        model = InstrumentType
        exclude_fields = ('instrument_enum',)


class InstrumentSystemObjectType(DjangoObjectType):
    class Meta:
        model = InstrumentSystem
        exclude_fields = (
            'instrument_system_enum',
            'road_condition_action_instrument_system',)


class Query(action_schema.Query, graphene.ObjectType):
    instruments = graphene.List(InstrumentObjectType,
                                instrument_id=graphene.Int(),
                                name=graphene.String(),
                                instrument_type_id=graphene.Int(),
                                instrument_system_id=graphene.Int(),
                                desc=graphene.String(),
                                folder_id=graphene.Int(),
                                scenario_id=graphene.Int(),
                                label_name=graphene.String())
    instrument_types = graphene.List(InstrumentTypeObjectType,
                                     instrument_type_id=graphene.Int(),
                                     name=graphene.String(),
                                     desc=graphene.String())
    instrument_systems = graphene.List(InstrumentSystemObjectType,
                                       instrument_system_id=graphene.Int(),
                                       name=graphene.String())

    def resolve_instruments(self, info, instrument_id=None, name=None,
                            instrument_type_id=None,
                            instrument_system_id=None, desc=None,
                            folder_id=None,
                            scenario_id=None, label_name=None, **kwargs):
        """
        Queries instruments from the database
        :param label_name:
        :param info:
        :param instrument_id: The instrument ID to filter on
        :param name: The (part of the) name to filter on
        :param instrument_type_id: The instrument_type ID to filter on
        :param instrument_system_id: The instrument_system ID to filter on
        :param desc: The (part of the) description to filter on
        :param folder_id: The folder ID to filter on
        :param scenario_id: The scenario ID to filter on
        :param kwargs:
        :return: All (filtered) instruments
        """
        res = Instrument.objects.all()
        if scenario_id:
            rs = RoadSegment.objects.filter(scenario__id=scenario_id).all()
            rc = RoadCondition.objects.filter(
                road_segment_road_condition__in=rs).all()
            rca = RoadConditionAction.objects.filter(
                road_condition_road_condition_actions__in=rc).all()
            ia = InstrumentAction.objects.filter(
                road_condition_action_instrument_action__in=rca).all()
            res = res.filter(Q(instrument_actions__id__in=ia)).distinct()
        if instrument_id:
            res = res.filter(Q(id__exact=instrument_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if instrument_type_id:
            res = res.filter(Q(instrument_type__id__exact=instrument_type_id))
        if instrument_system_id:
            res = res.filter(
                Q(instrument_system__id__exact=instrument_system_id))
        if desc:
            res = res.filter(Q(description__icontains=desc))
        if label_name:
            res = res.filter(
                Q(labels__unique_label__icontains=label_name.lower()))

        return res

    def resolve_instrument_types(self, info, instrument_type_id=None,
                                 name=None, desc=None, **kwargs):
        """
        Queries instrument_types from the database
        :param info:
        :param instrument_type_id: The instrument_type ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param kwargs:
        :return: ALl (filtered) instrument_types
        """
        res = InstrumentType.objects.all()
        if instrument_type_id:
            res = res.filter(Q(id__exact=instrument_type_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res

    def resolve_instrument_systems(self, info, instrument_system_id=None,
                                   name=None, **kwargs):
        """
        Queries instrument_systems from the database
        :param info:
        :param instrument_system_id: The instrument_system ID to filter on
        :param name: The (part of the) name to filter on
        :param kwargs:
        :return: All (filtered) instrument_systems
        """
        res = InstrumentSystem.objects.all()
        if instrument_system_id:
            res = res.filter(Q(id__exact=instrument_system_id))
        if name:
            res = res.filter(Q(name__icontains=name))

        return res


class CreateInstrument(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    instrument_type_id = graphene.Int()
    lat = graphene.Float()
    lng = graphene.Float()
    instrument_system_id = graphene.Int()
    description = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        instrument_type_id = graphene.Int(required=True)
        lat = graphene.Float(required=True)
        lng = graphene.Float(required=True)
        instrument_system_id = graphene.Int(required=True)
        description = graphene.String()
        labels = LabelArrayInputObject

    def mutate(self, info, name, instrument_type_id, lat, lng,
               instrument_system_id, description="", labels=[]):
        try:
            instrument = create_instrument(name, instrument_type_id, lat, lng,
                                           instrument_system_id, description,
                                           labels)

            return CreateInstrument(
                id=instrument.id,
                name=instrument.name,
                instrument_type_id=instrument.instrument_type.id,
                lat=instrument.lat,
                lng=instrument.lng,
                instrument_system_id=instrument.instrument_system.id,
                description=instrument.description,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateInstrument(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    lat = graphene.Float()
    lng = graphene.Float()
    description = graphene.String()
    instrument_system_id = graphene.Int()
    instrument_type_id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        lat = graphene.Float()
        lng = graphene.Float()
        description = graphene.String()
        instrument_system_id = graphene.Int()
        instrument_type_id = graphene.Int()
        labels = LabelArrayInputObject

    def mutate(self, info, id, name=None, lat=None, lng=None, description=None,
               instrument_system_id=None, instrument_type_id=None,
               labels=None):
        try:
            instrument = update_instrument(id, name, lat, lng, description,
                                           instrument_system_id,
                                           instrument_type_id, labels)

            return UpdateInstrument(
                id=instrument.id,
                name=instrument.name,
                instrument_type_id=instrument.instrument_type.id,
                lat=instrument.lat,
                lng=instrument.lng,
                instrument_system_id=instrument.instrument_system.id,
                description=instrument.description,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteInstrument(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        """
        Deletes the instrument, and the connected instrument_action
        :param info:
        :param id: The ID of the instrument
        :return:
        """
        try:
            delete_instrument(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(action_schema.Mutation, graphene.ObjectType):
    create_instrument = CreateInstrument.Field()
    update_instrument = UpdateInstrument.Field()
    delete_instrument = DeleteInstrument.Field()
