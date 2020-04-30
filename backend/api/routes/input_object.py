import graphene


class RoutePoint(graphene.InputObjectType):
    lat = graphene.Float(required=True)
    lng = graphene.Float(required=True)


RouteInputObject = graphene.List(RoutePoint)
