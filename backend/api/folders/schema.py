import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.folders import methods
from .models import *

from utils.auth import has_perms, engineer_required, operator_required


class FolderObjectType(DjangoObjectType):
    class Meta:
        model = Folder


class FolderTypeObjectType(DjangoObjectType):
    class Meta:
        model = FolderType


class Query(graphene.ObjectType):
    folders = graphene.List(
        FolderObjectType,
        folder_id=graphene.Int(),
        name=graphene.String(),
        desc=graphene.String(),
    )

    @operator_required
    def resolve_folders(self, info, folder_id=None, name=None, desc=None, **kwargs):
        """
        Queries folders from the database
        :param info:
        :param folder_id: The folder ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param kwargs:
        :return: All (filtered) folders
        """

        res = methods.get_all_folders()
        if folder_id:
            res = res.filter(Q(id__exact=folder_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))
        return res


class CreateFolder(graphene.Mutation):
    id = graphene.Int()
    parent_id = graphene.Int()
    folder_type_id = graphene.Int()
    name = graphene.String()
    description = graphene.String()

    class Arguments:
        parent_id = graphene.Int()
        folder_type_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        description = graphene.String()

    @engineer_required
    def mutate(self, info, folder_type_id, name, description="", parent_id=None):

        try:
            folder = methods.create_folder(name, folder_type_id, parent_id, description)

            return CreateFolder(
                id=folder.id,
                parent_id=folder.parent_id,
                folder_type_id=folder.folder_type.id,
                name=folder.name,
                description=folder.description,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateFolder(graphene.Mutation):
    """
    Updates folders according to what data was given.
    """

    id = graphene.Int()
    parent_id = graphene.Int()
    folder_type_id = graphene.Int()
    name = graphene.String()
    description = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        parent_id = graphene.Int()
        description = graphene.String()

    @engineer_required
    def mutate(self, info, id, name=None, parent_id=None, description=None):

        try:
            folder = methods.update_folder(id, name, parent_id, description)
            return UpdateFolder(
                id=folder.id,
                name=folder.name,
                folder_type_id=folder.folder_type.id,
                parent_id=folder.parent.id,
                description=folder.description,
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteFolder(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    @engineer_required
    def mutate(self, info, id, **kwargs):
        """
        Deletes the folder with the given ID
        :param info:
        :param id: The ID of the folder
        :param kwargs:
        :return:
        """

        try:
            methods.delete_folder(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_folder = CreateFolder.Field()
    update_folder = UpdateFolder.Field()
    delete_folder = DeleteFolder.Field()
