import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType

from api.labels.models import Label

from utils.auth import has_perms


class LabelObjectType(DjangoObjectType):
    class Meta:
        model = Label
        exclude_fields = (
            'scenario_labels', 'instrument_labels', 'unique_label')


class Query(graphene.ObjectType):
    labels = graphene.List(LabelObjectType,
                           label_id=graphene.Int(),
                           name=graphene.String(),
                           desc=graphene.String())

    def resolve_labels(self, info, label_id=None, name=None, desc=None,
                       **kwargs):
        """
        Queries labels from the database
        :param info:
        :param label_id: The label ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param kwargs:
        :return: All (filtered) folders
        """
        has_perms(info.context.user, ['labels.view_label'])

        res = Label.objects.all()
        if label_id:
            res = res.filter(Q(id__exact=label_id))
        if name:
            res = res.filter(Q(label__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))

        return res


class Mutation(graphene.ObjectType):
    pass
