from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema
from tests.api.folders.methods import create_folder_types, create_folders
from tests.api.road_conditions.methods import create_road_conditions, \
    create_road_condition_types, create_rc_to_rc
from tests.api.road_segments.methods import create_road_segments, \
    create_road_segment_types, create_rs_to_rc
from tests.api.scenarios.methods import create_scenarios


class RoadSegmentSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.folder_types = create_folder_types(
            ['Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
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
        self.condition_types = create_road_condition_types([
            'Test-Type-1', 'Test-Type-2'])
        self.conditions = create_road_conditions([
            'Test-Condition-1', 'Test-Condition-2'], self.condition_types)

    def test_query(self):
        client = Client(schema)
        segment = self.segments[0]
        executed = client.execute('''
                                    query {
                                        roadSegments
                                        (
                                            segmentId: %s,
                                            conditionId: -1,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % segment.id)
        self.assertEquals(executed['data']['roadSegments'], [])

    def test_query_children(self):
        client = Client(schema)
        segment = self.segments[0]
        condition = self.conditions[0]
        child = self.conditions[1]
        create_rs_to_rc([segment], [condition])
        create_rc_to_rc([condition], [child])
        executed = client.execute('''
                                    query {
                                        roadSegments
                                        (
                                            segmentId: %s,
                                            conditionId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (segment.id, child.id))
        self.assertEquals(executed['data']['roadSegments'][0]['name'],
                          segment.name)

    def test_query_types(self):
        client = Client(schema)
        segment_type = self.segment_types[0]
        executed = client.execute('''
                                    query {
                                        roadSegmentTypes
                                        (
                                            typeId: %s,
                                            name: "%s",
                                            desc: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (
            segment_type.id, segment_type.name, segment_type.description))
        self.assertEquals(executed['data']['roadSegmentTypes'][0]['name'],
                          segment_type.name)

    def test_create_correct(self):
        client = Client(schema)
        name = 'Test-Name'
        scenario = self.scenarios[0]
        segment = self.segment_types[0]
        executed = client.execute('''
                                    mutation {
                                        createRoadSegment
                                        (
                                            name: "%s",
                                            scenarioId: %s,
                                            roadSegmentTypeId: %s,
                                            route: [{lat: 0.00, lng: 0.00},
                                            {lat: 0.00, lng: 0.00}]
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (
            name, scenario.id, segment.id))
        self.assertEquals(executed['data']['createRoadSegment']['name'],
                          name)

    def test_update(self):
        client = Client(schema)
        segment = self.segments[1]
        name = 'New-Name'
        executed = client.execute('''
                                    mutation {
                                        updateRoadSegment
                                        (
                                            id: %s,
                                            name: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (segment.id, name))
        self.assertEquals(executed['data']['updateRoadSegment']['name'],
                          name)

    def test_delete(self):
        client = Client(schema)
        segment = self.segments[2]
        executed = client.execute('''
                                    mutation {
                                        deleteRoadSegment
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % segment.id)
        self.assertEquals(executed['data']['deleteRoadSegment'], None)
