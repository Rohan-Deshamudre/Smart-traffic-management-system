import graphene
import graphql_jwt

import api.api_schema
import users.schema


class Query(users.schema.Query, api.api_schema.Query, graphene.ObjectType):
    pass


class Mutation(api.api_schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
