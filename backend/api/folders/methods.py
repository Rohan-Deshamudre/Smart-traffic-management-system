from typing import List

from api.exception.api_exception import ObjectNotFoundException, \
    ConstraintException, InvalidInputException
from api.folders.exceptions import FolderParentIsInCurrentFolderException, \
    FolderIsSameAsParentException
from api.folders.models import Folder, FolderType
from api.scenarios.models import Scenario


# ##################################################### #
#                    FoldersTypes                       #
# ##################################################### #
def has_folder_type_with_id(folder_type_id: int) -> bool:
    return FolderType.objects.filter(id=folder_type_id).exists()


def get_folder_type_with_id(folder_id: int) -> Folder:
    if has_folder_type_with_id(folder_id):
        return FolderType.objects.get(id=folder_id)

    raise ObjectNotFoundException("FolderType", "id", folder_id)


# ##################################################### #
#                         Folders                       #
# ##################################################### #
def has_folder_with_id(folder_id: int) -> bool:
    return Folder.objects.filter(id=folder_id).exists()


def get_all_folders():
    return Folder.objects.all()


def get_folder_with_id(folder_id: int) -> Folder:
    if has_folder_with_id(folder_id):
        return Folder.objects.get(id=folder_id)

    raise ObjectNotFoundException("Folder", "id", folder_id)


def get_folder_children(folder: Folder) -> List[Folder]:
    """
    Gets all the child folders of a folder
    :param folder: The folder to find the child folders for
    :return: The child folders of a folder
    """
    children = []
    for c in Folder.objects.filter(parent_id=folder.id):
        children = children + [c] + get_folder_children(c)
    return children


def create_folder(name: str, folder_type_id: int, parent_id: int,
                  description: str) -> Folder:
    if name and folder_type_id:
        folder_type = get_folder_type_with_id(folder_type_id)
        folder = Folder(folder_type=folder_type, description=description)
        update_folder_name(folder, name)
        if parent_id:
            folder.parent = get_folder_with_id(parent_id)

        folder.save()
        return folder
    else:
        raise InvalidInputException()


def update_folder_name(folder: Folder, folder_name: str):
    if folder_name == folder.name:
        return
    if not Folder.objects.filter(name=folder_name).exists():
        folder.name = folder_name
    else:
        raise ConstraintException("Folder", "name", folder_name)


def update_folder_parent(folder: Folder, folder_parent_id: int):
    if folder.id == folder_parent_id:
        raise FolderIsSameAsParentException()
    parent_folder = get_folder_with_id(folder_parent_id)
    if parent_folder in get_folder_children(folder):
        raise FolderParentIsInCurrentFolderException(
            folder.id, folder_parent_id)
    folder.parent = parent_folder


def update_folder(folder_id: int, name: str, parent_id: int,
                  description: str) -> Folder:
    folder = get_folder_with_id(folder_id)
    if parent_id:
        update_folder_parent(folder, parent_id)

    if name:
        update_folder_name(folder, name)

    folder.description = description if description else folder.description
    folder.save()
    return folder


def delete_folder(folder_id: int):
    folder = get_folder_with_id(folder_id)
    folder_parent = folder.parent

    for scenarios in Scenario.objects.filter(folder=folder).all():
        """
        Updates the folder_id of the scenarios
        that are affected. Sets the folder_id to the parent_id.
        """
        scenarios.folder = folder_parent
        scenarios.save()
    for child_folder in Folder.objects.filter(parent=folder).all():
        child_folder.parent = folder_parent
        child_folder.save()
    folder.delete()
