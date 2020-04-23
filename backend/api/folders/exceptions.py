from api.exception.api_exception import ApiException


class FolderIsSameAsParentException(ApiException):
    def __init__(self):
        self.message = "Folder is same as parent folder"


class FolderParentIsInCurrentFolderException(ApiException):
    def __init__(self, folder_id: int, parent_id: int):
        self.message = "Parent folder with id = %s is" \
                       " a child of folder with id = %s" % (
                           parent_id, folder_id)


class InvalidFolderTypeException(ApiException):
    def __init__(self, type_expected: str, type_received: str):
        self.message = "Folder is of type %s, but type %s is expected" % (
            type_received, type_expected)
