import graphene
import graphql_jwt

from .scenarios import schema as scenario_schema
from .road_segments import schema as road_segment_schema
from .road_conditions import schema as road_condition_schema
from .instruments import schema as instrument_schema
from .simulations import schema as simulation_schema
from .routes import schema as routes_schema
from .labels import schema as labels_schema
from .folders import schema as folders_schema
from .response_plans import schema as response_plan_schema


class Query(
    routes_schema.Query,
    road_condition_schema.Query,
    road_segment_schema.Query,
    scenario_schema.Query,
    instrument_schema.Query,
    simulation_schema.Query,
    folders_schema.Query,
    labels_schema.Query,
    response_plan_schema.Query,
    graphene.ObjectType,
):
    pass


class Mutation(
    routes_schema.Mutation,
    instrument_schema.Mutation,
    scenario_schema.Mutation,
    road_condition_schema.Mutation,
    road_segment_schema.Mutation,
    simulation_schema.Mutation,
    folders_schema.Mutation,
    labels_schema.Mutation,
    response_plan_schema.Mutation,
    graphene.ObjectType,
):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
