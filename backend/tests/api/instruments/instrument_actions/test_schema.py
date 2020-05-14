from django.test import TestCase
from graphene.test import Client

from scenwise_backend.schema import schema
from tests.api.instruments.instrument_actions.methods import \
    create_instrument_actions
from tests.api.instruments.methods import create_instrument_types, \
    create_instrument_systems, create_instruments


class InstrumentActionSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.instrument_types = create_instrument_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.instrument_systems = create_instrument_systems([
            'Test-Sys-1', 'Test-Sys-2', 'Test-Sys-3'])
        self.instruments = create_instruments([
            'Test-Instr-1', 'Test-Instr-2', 'Test-Instr-3'],
            self.instrument_types[0], self.instrument_systems[0])
        self.instrument_actions = create_instrument_actions(
            self.instruments)

    def test_query(self):
        client = Client(schema)
        instrument_action = self.instrument_actions[0]
        instrument = instrument_action.instrument
        executed = client.execute('''
                                    query {
                                        instrumentActions
                                        (
                                            instrumentId: %s,
                                            desc: "%s"
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % (instrument.id,
                                           instrument_action.description))
        self.assertEquals(executed['data']['instrumentActions'][0]['id'],
                          str(instrument_action.id))

    def test_query_id(self):
        client = Client(schema)
        instrument_action = self.instrument_actions[0]
        executed = client.execute('''
                                    query {
                                        instrumentActions
                                        (
                                            instrumentActionId: %s
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % instrument_action.id)
        self.assertEquals(executed['data']['instrumentActions'][0]['id'],
                          str(instrument_action.id))

    def test_create_correct(self):
        client = Client(schema)
        instrument = self.instruments[0]
        text = "blablabla"
        executed = client.execute('''
                                    mutation {
                                        createInstrumentAction
                                        (
                                            instrumentId: %s,
                                            text: "%s"
                                        )
                                        {
                                            instrumentId
                                        }
                                    }
                                    ''' % (instrument.id, text))
        self.assertEquals(executed['data']['createInstrumentAction']['instrumentId'],
                          instrument.id)

    def test_update(self):
        client = Client(schema)
        instrument_action = self.instrument_actions[0]
        instrument = self.instruments[1]
        executed = client.execute('''
                                    mutation {
                                        updateInstrumentAction
                                        (
                                            id: %s,
                                            instrumentId: %s,
                                            text: "tekstkar",
                                            description: "drip",
                                            routes: {lat: 0, lng: 0}
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % (
            instrument_action.id, instrument.id))
        self.assertEquals(executed['data']['updateInstrumentAction']['id'],
                          instrument_action.id)

    def test_update_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateInstrumentAction
                                        (
                                            id: -99
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Instrumentaction with id = -99 does not exist!")

    def test_delete(self):
        client = Client(schema)
        instrument_action = self.instrument_actions[0]
        executed = client.execute('''
                                    mutation {
                                        deleteInstrumentAction
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % instrument_action.id)
        self.assertEquals(executed['data']['deleteInstrumentAction'], None)

    def test_delete_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteInstrumentAction
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Instrumentaction with id = -99 does not exist!")
