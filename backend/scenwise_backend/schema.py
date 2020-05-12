import graphene
import graphql_jwt

import api.api_schema
import users.schema

from utils.CustomJSONWebTokenMutation import ObtainJSONWebToken

class Query(users.schema.Query, api.api_schema.Query, graphene.ObjectType):
    pass


class Mutation(api.api_schema.Mutation, graphene.ObjectType):
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
