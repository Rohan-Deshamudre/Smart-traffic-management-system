import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.input_object import \
    RoadConstraintInputObject
from api.road_conditions.road_condition_actions.methods.create import \
    create_road_condition_action
from api.road_conditions.road_condition_actions.methods.delete import \
    delete_road_condition_action
from api.road_conditions.road_condition_actions.methods.update import \
    update_road_condition_action
from api.road_conditions.road_condition_actions. \
    road_condition_action_constraint.models import \
    RoadConditionActionConstraintType

from .models import *


class RoadConditionActionObjectType(DjangoObjectType):
    class Meta:
        model = RoadConditionAction
        exclude_fields = ('road_condition_instrument_actions',)


class RoadConditionActionConstraintObjectType(DjangoObjectType):
    class Meta:
        model = RoadConditionActionConstraint
        exclude_fields = ()


class RoadConditionActionConstraintTypeObjectType(DjangoObjectType):
    class Meta:
        model = RoadConditionActionConstraintType
        exclude_fields = ()


class RoadConditionActionGoalObjectType(DjangoObjectType):
    class Meta:
        model = RoadConditionActionGoal
        exclude_fields = ('instrument_action_action_goal',
                          'road_condition_action_instrument_action',)


class RoadConditionActionInputObject(graphene.InputObjectType):
    road_condition_action_goal_id = graphene.Int(required=True)
    instrument_system_id = graphene.Int(required=True)
    action_name = graphene.String(required=True)
    constraint = RoadConditionActionGoalObjectType
    description = graphene.String()
    instrument_action_ids = graphene.List(graphene.Int, required=True)


class Query(graphene.ObjectType):
    road_condition_actions = graphene.List(
        RoadConditionActionObjectType,
        action_id=graphene.Int())
    road_condition_action_goals = graphene.List(
        RoadConditionActionGoalObjectType,
        goal_id=graphene.Int(),
        name=graphene.String(),
        desc=graphene.String())

    road_condition_action_constraints = graphene.List(
        RoadConditionActionConstraintObjectType,
        constraint_id=graphene.Int(),
        name=graphene.String(),
        type_id=graphene.Int())

    road_condition_action_constraint_types = graphene.List(
        RoadConditionActionConstraintTypeObjectType,
        type_id=graphene.Int(),
        name=graphene.String(),
        desc=graphene.String())

    def resolve_road_condition_actions(self, info, action_id=None):
        """
        Queries road_condition_actions from the database
        :param info:
        :param action_id: The action ID to filter on
        :return: All (filtered) road_condition_actions
        """
        res = RoadConditionAction.objects.all()
        if action_id:
            res = res.filter(Q(id__exact=action_id))

        return res

    def resolve_road_condition_action_goals(self, info, goal_id=None,
                                            name=None, desc=None, **kwargs):
        """
        Queries road_condition_action_goals from the database
        :param info:
        :param goal_id: The goal ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param kwargs:
        :return: All (filtered) road_condition_action_goals
        """
        res = RoadConditionActionGoal.objects.all()
        if goal_id:
            res = res.filter(Q(id__exact=goal_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res

    def resolve_road_condition_action_constraints(self, info,
                                                  constraint_id=None,
                                                  name=None,
                                                  type_id=None,
                                                  **kwargs):
        """
        Queries road_condition_action_constraints from the database
        :param info:
        :param constraint_id: The constraint ID to filter on
        :param name: The (part of the) name to filter on
        :param type_id: The constraint type ID to filter on
        :param kwargs:
        :return: All (filtered) road_condition_action_constraints
        """
        res = RoadConditionActionConstraint.objects.all()
        if constraint_id:
            res = res.filter(Q(id__exact=constraint_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if type_id:
            res = res.filter(Q(constraint_type__id=type_id))

        return res

    def resolve_road_condition_action_constraint_types(self, info,
                                                       type_id=None,
                                                       name=None,
                                                       desc=None):
        """
        Queries road_condition_action_constraint_types from the database
        :param info:
        :param type_id: The constraint type ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :return: All (filtered) road_condition_action_constraint_types
        """
        res = RoadConditionActionConstraintType.objects.all()
        if type_id:
            res = res.filter(Q(id__exact=type_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res


class CreateRoadConditionAction(graphene.Mutation):
    id = graphene.Int()
    road_condition_action_goal_id = graphene.Int()
    instrument_system_id = graphene.Int()
    action_name = graphene.String()
    description = graphene.String()

    class Arguments:
        road_condition_action_goal_id = graphene.Int(required=True)
        instrument_system_id = graphene.Int(required=True)
        action_name = graphene.String(required=True)
        constraint = RoadConstraintInputObject()
        description = graphene.String()
        instrument_action_ids = graphene.List(graphene.Int, required=True)
        road_condition_id = graphene.Int(required=True)

    def mutate(self, info, road_condition_action_goal_id, instrument_system_id,
               action_name, road_condition_id,
               constraint=None, description="", instrument_action_ids=[]):
        try:
            road_condition_action = create_road_condition_action(
                road_condition_id, instrument_system_id, action_name,
                road_condition_action_goal_id, constraint, description,
                instrument_action_ids)

            rcag = road_condition_action.road_condition_action_goal.id
            rcai = road_condition_action.instrument_system.id
            return \
                CreateRoadConditionAction(
                    id=road_condition_action.id,
                    road_condition_action_goal_id=rcag,
                    instrument_system_id=rcai,
                    action_name=road_condition_action.action_name,
                    description=road_condition_action.description,
                )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateRoadConditionAction(graphene.Mutation):
    id = graphene.Int()
    road_condition_action_goal_id = graphene.Int()
    instrument_system_id = graphene.Int()
    action_name = graphene.String()
    description = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)
        road_condition_action_goal_id = graphene.Int()
        instrument_system_id = graphene.Int()
        action_name = graphene.String()
        constraint = RoadConstraintInputObject()
        description = graphene.String()
        instrument_action_ids = graphene.List(graphene.Int)

    def mutate(self, info, id, road_condition_action_goal_id=None,
               instrument_system_id=None, action_name=None,
               constraint=None, description=None, instrument_action_ids=None):
        try:
            road_condition_action = \
                update_road_condition_action(id,
                                             instrument_system_id,
                                             action_name,
                                             road_condition_action_goal_id,
                                             constraint,
                                             description,
                                             instrument_action_ids)
            rcag = road_condition_action.road_condition_action_goal.id
            rcai = road_condition_action.instrument_system.id
            return UpdateRoadConditionAction(
                id=road_condition_action.id,
                road_condition_action_goal_id=rcag,
                instrument_system_id=rcai,
                action_name=road_condition_action.action_name,
                description=road_condition_action.description,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteRoadConditionAction(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id):
        try:
            delete_road_condition_action(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_road_condition_action = CreateRoadConditionAction.Field()
    update_road_condition_action = UpdateRoadConditionAction.Field()
    delete_road_condition_action = DeleteRoadConditionAction.Field()
