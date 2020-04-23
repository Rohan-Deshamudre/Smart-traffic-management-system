from django.test import TestCase

from api.folders.models import Folder, FolderType
from tests.api.folders.methods import create_folder_types, create_folders


class FolderModelTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.folders = create_folders(['Test-1', 'Test-2', 'Test-3'],
                                      self.folder_types)

    def test_folder_creation(self):
        folder = self.folders[0]
        self.assertTrue(isinstance(folder, Folder))
