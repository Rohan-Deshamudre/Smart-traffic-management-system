import graphene
import graphql_jwt

import api.api_schema
import users.schema


class Query(users.schema.Mutation, api.api_schema.Query, graphene.ObjectType):
    pass


class Mutation(users.schema.Mutation, api.api_schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
