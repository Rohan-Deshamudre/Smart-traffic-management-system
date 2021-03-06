import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.response_plans import methods
from .models import *

from utils.auth import engineer_required, operator_required


class ResponsePlanObjectType(DjangoObjectType):
    class Meta:
        model = ResponsePlan


class Query(graphene.ObjectType):
    response_plans = graphene.List(ResponsePlanObjectType,
                                   response_plan_id=graphene.Int(),
                                   operator=graphene.String())

    @operator_required
    def resolve_response_plans(self, info,
                               response_plan_id=None,
                               operator=None, **kwargs):
        res = methods.get_all_response_plans()
        if response_plan_id:
            res = res.filter(Q(id__exact=response_plan_id))
        if operator:
            res = res.filter(Q(operator__icontains=operator))
        return res


class CreateResponsePlan(graphene.Mutation):
    id = graphene.Int()
    road_segment_id = graphene.Int()
    operator = graphene.String()
    road_condition_id = graphene.Int()
    scenario_id = graphene.Int()
    parent_id = graphene.Int()

    class Arguments:
        operator = graphene.String(required=True)
        scenario_id = graphene.Int()
        road_segment_id = graphene.Int()
        road_condition_id = graphene.Int()
        parent_id = graphene.Int()

    @engineer_required
    def mutate(self, info, operator,
               road_segment_id=None,
               road_condition_id=None,
               scenario_id=None,
               parent_id=None):
        try:
            response_plan = methods.create_response_plan(
                road_segment_id,
                operator,
                road_condition_id,
                scenario_id,
                parent_id
            )

            road_condition_id = response_plan.road_condition.id if road_condition_id else None
            road_segment_id = response_plan.road_segment.id if road_segment_id else None
            scenario_id = response_plan.scenario.id if scenario_id else None

            return CreateResponsePlan(
                id=response_plan.id,
                road_segment_id=road_segment_id,
                operator=response_plan.operator,
                road_condition_id=road_condition_id,
                scenario_id=scenario_id,
                parent_id=response_plan.parent_id
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateResponsePlan(graphene.Mutation):
    id = graphene.Int()
    road_segment_id = graphene.Int()
    operator = graphene.String()
    road_condition_id = graphene.Int()
    scenario_id = graphene.Int()
    parent_id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)
        road_segment_id = graphene.Int()
        operator = graphene.String()
        road_condition_id = graphene.Int()
        scenario_id = graphene.Int()
        parent_id = graphene.Int()

    @engineer_required 
    def mutate(self, info, id, road_segment_id=None, operator=None,
               road_condition_id=None, scenario_id=None, parent_id=None):
        try:
            response_plan = methods.update_response_plan(id,
                                                         road_segment_id,
                                                         operator,
                                                         road_condition_id,
                                                         scenario_id,
                                                         parent_id)

            road_condition_id = response_plan.road_condition.id if response_plan.road_condition else None
            road_segment_id = response_plan.road_segment.id if road_segment_id else None
            scenario_id = response_plan.scenario.id if scenario_id else None

            return UpdateResponsePlan(
                id=response_plan.id,
                road_segment_id=road_segment_id,
                operator=response_plan.operator,
                road_condition_id=road_condition_id,
                scenario_id=scenario_id,
                parent_id=response_plan.parent_id
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteResponsePlan(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    @engineer_required
    def mutate(self, info, id, **kwargs):
        try:
            methods.delete_response_plan(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_response_plan = CreateResponsePlan.Field()
    update_response_plan = UpdateResponsePlan.Field()
    delete_response_plan = DeleteResponsePlan.Field()
