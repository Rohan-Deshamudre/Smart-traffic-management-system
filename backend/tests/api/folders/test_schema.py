from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema

from tests.api.folders.test_methods import create_folder_types, create_folders


class FolderSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.folders = create_folders(['Test-1', 'Test-2', 'Test-3'],
                                      self.folder_types)

    def test_query(self):
        client = Client(schema)
        folder = self.folders[0]
        executed = client.execute('''
                                    query {
                                        folders
                                        (
                                            name: "%s",
                                            desc: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (folder.name, folder.description))
        self.assertEquals(executed['data']['folders'][0]['name'],
                          folder.name)

    def test_query_id(self):
        client = Client(schema)
        folder = self.folders[0]
        executed = client.execute('''
                                    query {
                                        folders
                                        (
                                            folderId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % folder.id)
        self.assertEquals(executed['data']['folders'][0]['name'],
                          folder.name)

    def test_create_correct(self):
        client = Client(schema)
        new_name = 'Test-Name'
        new_desc = 'Test-Desc'
        folder = self.folders[0]
        folder_type = self.folder_types[0]
        executed = client.execute('''
                                    mutation {
                                        createFolder
                                        (
                                            name: "%s",
                                            description: "%s",
                                            folderTypeId: %s,
                                            parentId: %s
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (
            new_name, new_desc, folder_type.id, folder.id))
        self.assertEquals(executed['data']['createFolder']['name'],
                          new_name)

    def test_update(self):
        client = Client(schema)
        folder1 = self.folders[0]
        folder3 = self.folders[2]
        new_des = 'New-Desc'
        executed = client.execute('''
                                    mutation {
                                        updateFolder
                                        (
                                            id: %s,
                                            description: "%s"
                                            parentId: %s
                                        )
                                        {
                                            description
                                        }
                                    }
                                    ''' % (folder1.id, new_des, folder3.id))
        self.assertEquals(executed['data']['updateFolder']['description'],
                          new_des)

    def test_update_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateFolder
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Folder with id = -99 does not exist!")

    def test_delete(self):
        client = Client(schema)
        folder = self.folders[0]
        executed = client.execute('''
                                    mutation {
                                        deleteFolder
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % folder.id)
        self.assertEquals(executed['data']['deleteFolder'], None)

    def test_delete_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteFolder
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Folder with id = -99 does not exist!")
