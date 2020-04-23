import graphene

import api.api_schema


class Query(api.api_schema.Query, graphene.ObjectType):
    pass


class Mutation(api.api_schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
