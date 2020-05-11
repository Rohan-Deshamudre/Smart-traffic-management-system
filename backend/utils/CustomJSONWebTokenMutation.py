import graphene
import graphql_jwt

from users.groups.schema import GroupType

class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    group = graphene.List(GroupType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        print(info.context.user.groups)
        return cls(group=info.context.user.groups.all())
