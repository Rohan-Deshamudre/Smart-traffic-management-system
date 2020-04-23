from typing import List

from api.folders.models import FolderType, Folder


def create_folder_types(names: List[str]) -> List[FolderType]:
    folder_types = []
    for name in names:
        folder_type = FolderType(name=name)
        folder_type.save()
        folder_types.append(folder_type)
    return folder_types


def create_folders(names: List[str], folder_types: List[FolderType]) \
        -> List[Folder]:
    folders = []

    for x in range(len(names)):
        folder = Folder(name=names[x], folder_type=folder_types[x],
                        description="boomerang")
        folder.save()
        child_folder = Folder(name='child-%s' % names[x],
                              folder_type=folder_types[x],
                              parent=folder)
        child_folder.save()
        folders.append(folder)
        folders.append(child_folder)
    return folders
