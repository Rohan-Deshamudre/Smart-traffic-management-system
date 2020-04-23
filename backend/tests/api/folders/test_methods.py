from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException, \
    ConstraintException, InvalidInputException
from api.folders.exceptions import FolderIsSameAsParentException, \
    FolderParentIsInCurrentFolderException
from api.folders.methods import create_folder, get_folder_type_with_id, \
    has_folder_type_with_id, get_folder_with_id, \
    has_folder_with_id, get_all_folders, get_folder_children, \
    update_folder_name, update_folder_parent, update_folder, \
    delete_folder
from api.folders.models import Folder
from api.scenarios.methods.getter import get_scenario_with_id
from api.scenarios.models import Scenario
from tests.api.folders.methods import create_folder_types, create_folders


class FolderModelTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.folders = create_folders(['Test-1', 'Test-2', 'Test-3'],
                                      self.folder_types)

    def test_has_and_get_folder_type(self):
        folder_type = self.folder_types[0]
        getter_folder_type = get_folder_type_with_id(folder_type.id)
        self.assertEqual(folder_type, getter_folder_type)
        self.assertTrue(has_folder_type_with_id(folder_type.id))

    def test_has_and_get_folder(self):
        folder = self.folders[0]
        getter_folder = get_folder_with_id(folder.id)
        self.assertEqual(folder, getter_folder)
        self.assertTrue(has_folder_with_id(folder.id))

    def test_get_folder_type_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_folder_type_with_id(-1)

    def test_get_folder_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_folder_with_id(-1)

    def test_get_all(self):
        for folder in get_all_folders():
            self.assertIn(folder, self.folders)

    def test_get_child(self):
        folder = self.folders[0]
        child = get_folder_children(folder)
        self.assertTrue(len(child), 1)
        self.assertTrue(folder.name, 'child-%s' % folder.name)

    def test_folder_creation(self):
        folder_type = self.folder_types[0]
        folder = create_folder("Test-Name-Folder", folder_type.id, None,
                               "")
        created_folder = get_folder_with_id(folder.id)

        self.assertTrue(len(Folder.objects.all()), len(get_all_folders()))
        self.assertEqual(folder, created_folder)

    def test_folder_creation_parent(self):
        folder_type = self.folder_types[0]
        folder = self.folders[0]
        folder = create_folder("Test-Name-Folder", folder_type.id, folder.id,
                               "")
        created_folder = get_folder_with_id(folder.id)

        self.assertTrue(len(Folder.objects.all()), len(get_all_folders()))
        self.assertEqual(folder, created_folder)

    def test_folder_creation_none(self):
        with self.assertRaises(InvalidInputException):
            create_folder(None, None, None, None)

    def test_update_name(self):
        folder = self.folders[0]
        new_name = "Test-Name-Folder-1"
        update_folder_name(folder, new_name)

        self.assertEqual(folder.name, new_name)

    def test_update_same_name(self):
        folder = self.folders[0]
        new_name = folder.name
        update_folder_name(folder, new_name)

        self.assertEqual(folder.name, new_name)

    def test_update_name_exception(self):
        folder = self.folders[0]
        existing_name = self.folders[1].name
        with self.assertRaises(ConstraintException):
            update_folder_name(folder, existing_name)

    def test_update_parent(self):
        folder = self.folders[0]
        new_parent = self.folders[2]
        update_folder_parent(folder, new_parent.id)
        self.assertEqual(folder.parent, new_parent)

    def test_update_parent_exception_1(self):
        folder = self.folders[0]
        with self.assertRaises(FolderIsSameAsParentException):
            update_folder_parent(folder, folder.id)

    def test_update_parent_exception_2(self):
        folder = self.folders[0]
        child = get_folder_children(folder)[0]
        with self.assertRaises(FolderParentIsInCurrentFolderException):
            update_folder_parent(folder, child.id)

    def test_update(self):
        folder = self.folders[0]
        new_name = 'New-Name-1'
        new_description = 'New-Name-1'
        new_folder = update_folder(folder.id, new_name, None,
                                   new_description)
        get_folder_with_id(folder.id)
        self.assertEqual(new_folder.name, new_name)
        self.assertEqual(new_folder.description, new_description)
        self.assertEqual(new_folder, get_folder_with_id(folder.id))

    def test_delete(self):
        self.assertEqual(len(get_all_folders()), 6)
        folder = self.folders[0]
        scenario = Scenario(name="boomerang", description="tori",
                            start_lat=0, start_lng=0, end_lat=0, end_lng=0,
                            folder=folder)
        scenario.save()
        delete_folder(folder.id)
        updated_scenario = get_scenario_with_id(scenario.id)
        self.assertEqual(len(get_all_folders()), 5)
        self.assertEqual(updated_scenario.folder, None)
