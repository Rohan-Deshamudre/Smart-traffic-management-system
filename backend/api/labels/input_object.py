import graphene


class LabelInputObject(graphene.InputObjectType):
    label = graphene.String(required=True)
    description = graphene.String(required=False)


LabelArrayInputObject = graphene.List(LabelInputObject)
