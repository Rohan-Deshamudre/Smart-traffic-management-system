from django.test import TestCase
from graphene.test import Client

from api.labels.models import Label
from api.scenarios.models import ScenarioToLabel
from scenwise_backend.schema import schema
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_segments.methods import create_road_segments, \
    create_road_segment_types
from tests.api.scenarios.methods import create_scenarios


class ScenarioSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['scenarios', 'Test-Type-2', 'Test-Type-3'])
        self.folders = create_folders(['Test-1', 'Test-2', 'Test-3'],
                                      self.folder_types)
        self.scenarios = create_scenarios([
            'Test-Scenario-1', 'Test-Scenario-2', 'Test-Scenario-3'],
            self.folders)
        self.segment_types = create_road_segment_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.segments = create_road_segments([
            'Test-Name-1', 'Test-Name-2', 'Test-Name-3'], self.scenarios,
            self.segment_types)

    def test_query_id(self):
        client = Client(schema)
        scenario = self.scenarios[0]
        executed = client.execute('''
                                    query {
                                        scenarios
                                        (
                                            scenarioId: %s
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % scenario.id)
        self.assertEquals(executed['data']['scenarios'][0]['name'],
                          scenario.name)

    def test_query(self):
        client = Client(schema)
        scenario = self.scenarios[0]
        folder = self.folders[0]
        segment = self.segments[0]
        label = Label()
        label.label = "boomerang"
        label.unique_label = "boomerang"
        label.description = "tori"
        label.save()
        ScenarioToLabel(scenario=scenario, label=label).save()
        executed = client.execute('''
                                    query {
                                        scenarios
                                        (
                                            name: "%s",
                                            desc: "boomerang",
                                            folderId: %s,
                                            roadSegmentId: %s,
                                            labelName: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (scenario.name,
                                           folder.id, segment.id,
                                           label.unique_label))
        self.assertEquals(executed['data']['scenarios'][0]['name'],
                          scenario.name)

    def test_create_correct(self):
        client = Client(schema)
        name = 'Test-Scenario'
        description = 'boomerang'
        folder = self.folders[0]
        label = Label()
        label.label = "boomerang"
        label.unique_label = "boomerang"
        label.description = "tori"
        label.save()
        executed = client.execute('''
                                    mutation {
                                        createScenario
                                        (
                                            name: "%s",
                                            description: "%s",
                                            folderId: %s,
                                            labels: {label:
                                            "%s", description: "%s"}
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (name, description, folder.id,
                                           label.unique_label,
                                           label.description))
        self.assertEquals(executed['data']['createScenario']['name'],
                          name)

    def test_update(self):
        client = Client(schema)
        scenario = self.scenarios[1]
        name = 'New-Name'
        description = 'Tori'
        folder = self.folders[0]
        label = Label()
        label.label = "boomerang"
        label.unique_label = "boomerang"
        label.description = "tori"
        label.save()
        executed = client.execute('''
                                    mutation {
                                        updateScenario
                                        (
                                            id: %s,
                                            name: "%s",
                                            description: "%s",
                                            folderId: %s,
                                            labels: [{label: "%s",
                                             description: "%s"}]
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (
            scenario.id, name, description, folder.id,
            label.unique_label, label.description))
        self.assertEquals(executed['data']['updateScenario']['name'],
                          name)

    def test_update_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateScenario
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Scenario with id = -99 does not exist!")

    def test_delete(self):
        client = Client(schema)
        scenario = self.scenarios[0]
        executed = client.execute('''
                                    mutation {
                                        deleteScenario
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % scenario.id)
        self.assertEquals(executed['data']['deleteScenario'], None)

    def test_delete_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteScenario
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Scenario with id = -99 does not exist!")
