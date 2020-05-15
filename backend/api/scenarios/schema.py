import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.labels.input_object import LabelArrayInputObject
from api.scenarios.methods.create import create_scenario
from api.scenarios.methods.delete import delete_scenario
from api.scenarios.methods.update import update_scenario
from .models import *

from utils.auth import has_perms

class ScenarioObjectType(DjangoObjectType):
    class Meta:
        model = Scenario


class Query(graphene.ObjectType):
    scenarios = graphene.List(ScenarioObjectType,
                              scenario_id=graphene.Int(),
                              name=graphene.String(),
                              desc=graphene.String(),
                              folder_id=graphene.Int(),
                              road_segment_id=graphene.Int(),
                              label_name=graphene.String())

    def resolve_scenarios(self, info, scenario_id=None, name=None, desc=None,
                          folder_id=None, road_segment_id=None,
                          label_name=None, **kwargs):
        """
        Queries scenarios from the database
        :param info:
        :param scenario_id: The scenario ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param folder_id: The folder ID to filter on
        :param road_segment_id: the road_segment ID to filter on
        :param kwargs:
        :return: All (filtered) scenarios
        """
        has_perms(info, ['scenarios.view_scenario'])
        res = Scenario.objects.all()
        if scenario_id:
            res = res.filter(Q(id__exact=scenario_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))
        if folder_id:
            res = res.filter(Q(folder__id__exact=folder_id))
        if road_segment_id:
            res = res.filter(Q(road_segments__id__exact=road_segment_id))
        if label_name:
            res = res.filter(
                Q(labels__unique_label__icontains=label_name.lower()))

        return res


class CreateScenario(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    description = graphene.String()
    folder_id = graphene.Int()

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        folder_id = graphene.Int()
        labels = LabelArrayInputObject

    def mutate(self, info, name, description="", folder_id=None, labels=None):
        has_perms(info, ['scenarios.add_scenario'])
        try:
            scenario = create_scenario(name, folder_id, description, False,
                                       labels)

            return CreateScenario(
                id=scenario.id,
                name=scenario.name,
                description=scenario.description,
                folder_id=scenario.folder_id
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateScenario(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    description = graphene.String()
    folder_id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()
        folder_id = graphene.Int()
        labels = LabelArrayInputObject

    def mutate(self, info, id, name=None, description=None, folder_id=None,
               labels=None):
        has_perms(info, ['scenarios.change_scenario'])
        try:
            scenario = update_scenario(id, name, folder_id, description,
                                       labels)
            return UpdateScenario(
                id=scenario.id,
                name=scenario.name,
                description=scenario.description,
                folder_id=scenario.folder_id
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteScenario(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        """
        Deletes the scenario
        :param info:
        :param id: The ID of the scenario
        :return:
        """
        has_perms(info, ['scenarios.delete_scenario'])
        try:
            delete_scenario(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_scenario = CreateScenario.Field()
    update_scenario = UpdateScenario.Field()
    delete_scenario = DeleteScenario.Field()
