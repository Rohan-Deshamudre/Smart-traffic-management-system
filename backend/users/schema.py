from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission

import graphene
from graphene_django import DjangoObjectType

from utils.auth import has_perms


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)
    test = graphene.Field(UserType)

    def resolve_users(self, info):
        return get_user_model().objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user

    def resolve_test(self, info):
        user = info.context.user

        has_perms(user, ['simulations.change_simulation',
                         'simulations.view_simulation'
                         ])

        return user
