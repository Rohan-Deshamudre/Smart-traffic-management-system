import graphene


class RoadConstraintInputObject(graphene.InputObjectType):
    name = graphene.String(required=True)
    type = graphene.Int(required=True)
