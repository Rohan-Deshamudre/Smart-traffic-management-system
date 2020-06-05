import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.road_conditions.input_object import RoadConditionDateInputObject
from api.road_conditions.methods.create import create_road_condition
from api.road_conditions.methods.delete import delete_road_condition
from api.road_conditions.methods.update import update_road_condition
from .models import *
from .road_condition_actions import schema as actions_schema

from utils.auth import engineer_required, operator_required


class RoadConditionObjectType(DjangoObjectType):
    class Meta:
        model = RoadCondition
        exclude_fields = (
            "road_conditions_road_conditions",
            "road_segment_road_condition",
        )


class RoadConditionTypeObjectType(DjangoObjectType):
    class Meta:
        model = RoadConditionType
        exclude_fields = (
            "road_condition_enum",
            "fk_simulationSceneEvent_roadConditionType",
        )


class RoadConditionDateObjectType(DjangoObjectType):
    class Meta:
        model = RoadConditionDate
        exclude_fields = ("road_condition_dates",)


class Query(actions_schema.Query, graphene.ObjectType):
    road_conditions = graphene.List(
        RoadConditionObjectType, condition_id=graphene.Int()
    )
    road_condition_types = graphene.List(
        RoadConditionTypeObjectType,
        type_id=graphene.Int(),
        name=graphene.String(),
        desc=graphene.String(),
    )

    @operator_required
    def resolve_road_conditions(self, info, condition_id=None):
        """
        Queries road_conditions from the database
        :param info:
        :param condition_id: The condition ID to filter on
        :return: All (filtered) road_conditions
        """
        res = RoadCondition.objects.all()
        if condition_id:
            res = res.filter(Q(id__exact=condition_id))

        return res

    @operator_required
    def resolve_road_condition_types(
        self, info, type_id=None, name=None, desc=None, **kwargs
    ):
        """
        Queries road_condition_types from the database
        :param info:
        :param type_id: The type ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param kwargs:
        :return: All (filtered) road_condition_types
        """
        res = RoadConditionType.objects.all()
        if type_id:
            res = res.filter(Q(id__exact=type_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res


class CreateRoadCondition(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    value = graphene.Int()
    road_condition_type_id = graphene.Int()

    class Arguments:
        name = graphene.String(required=True)
        date = RoadConditionDateInputObject(required=True)
        value = graphene.Int(required=True)
        road_condition_type_id = graphene.Int(required=True)
        road_condition_actions = graphene.List(graphene.Int)
        parent_rc = graphene.Int()
        parent_rs = graphene.Int()

    @engineer_required
    def mutate(
        self,
        info,
        name,
        value,
        road_condition_type_id,
        date=None,
        road_condition_actions=[],
        parent_rc=None,
        parent_rs=None,
    ):
        try:
            road_condition = create_road_condition(
                name,
                date,
                value,
                road_condition_type_id,
                road_condition_actions,
                parent_rc,
                parent_rs,
            )

            return CreateRoadCondition(
                id=road_condition.id,
                name=road_condition.name,
                value=road_condition.value,
            )

        except ApiException as exc:
            GraphQLError(str(exc))


class UpdateRoadCondition(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    value = graphene.Int()
    road_condition_type_id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        date = RoadConditionDateInputObject()
        value = graphene.Int()
        road_condition_type_id = graphene.Int()
        road_condition_actions = graphene.List(graphene.Int)
        parent_rc = graphene.Int()
        parent_rs = graphene.Int()

    @engineer_required
    def mutate(
        self,
        info,
        id,
        name=None,
        date=None,
        value=None,
        road_condition_type_id=None,
        road_condition_actions=None,
        parent_rc=None,
        parent_rs=None,
    ):
        try:
            road_condition = update_road_condition(
                id,
                name,
                date,
                value,
                road_condition_type_id,
                parent_rc,
                parent_rs,
                road_condition_actions,
            )

            return UpdateRoadCondition(
                id=road_condition.id,
                name=road_condition.name,
                value=road_condition.value,
                road_condition_type_id=road_condition.road_condition_type.id,
            )
        except ApiException as exc:
            GraphQLError(str(exc))


class DeleteRoadCondition(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    @engineer_required
    def mutate(self, info, id):
        """
        Deletes the road_condition
        :param info:
        :param id: The ID of the road_condition
        :return:
        """
        try:
            delete_road_condition(id)
        except ApiException as exc:
            GraphQLError(str(exc))


class Mutation(actions_schema.Mutation, graphene.ObjectType):
    create_road_condition = CreateRoadCondition.Field()
    update_road_condition = UpdateRoadCondition.Field()
    delete_road_condition = DeleteRoadCondition.Field()
