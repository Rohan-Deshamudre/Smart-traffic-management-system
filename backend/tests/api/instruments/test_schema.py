from django.test import TestCase
from graphene.test import Client
from api.instruments.models import InstrumentToLabel
from api.labels.models import Label
from scenwise_backend.schema import schema
from tests.api.instruments.methods import create_instrument_types, \
    create_instrument_systems, create_instruments


class InstrumentSchemaTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.instrument_types = create_instrument_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.instrument_systems = create_instrument_systems([
            'Test-Sys-1', 'Test-Sys-2', 'Test-Sys-3'])
        self.instruments = create_instruments([
            'Test-Instr-1', 'Test-Instr-2', 'Test-Instr-3'],
            self.instrument_types[0], self.instrument_systems[0])

    def test_query(self):
        client = Client(schema)
        instrument = self.instruments[0]
        label = Label()
        label.label = "boomerang"
        label.unique_label = "boomerang"
        label.description = "tori"
        label.save()
        InstrumentToLabel(instrument=instrument, label=label).save()
        instrument.description = "bt"
        instrument.save()
        executed = client.execute('''
                                    query {
                                        instruments
                                        (
                                            name: "%s",
                                            instrumentTypeId: %s,
                                            instrumentSystemId: %s,
                                            desc: "%s",
                                            labelName: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (instrument.name,
                                           instrument.instrument_type.id,
                                           instrument.instrument_system.id,
                                           instrument.description,
                                           label.unique_label))
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('instruments', "
                          "[OrderedDict([("
                          "'name', '%s')])])])}" % instrument.name)

    def test_query_id(self):
        client = Client(schema)

        instrument = self.instruments[0]
        executed = client.execute('''
                                    query {
                                        instruments
                                        (
                                            instrumentId: %s,
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % instrument.id)
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('instruments', "
                          "[OrderedDict([("
                          "'name', '%s')])])])}" % instrument.name)

    def test_query_type(self):
        client = Client(schema)
        instrument_type = self.instrument_types[0]
        instrument_type.description = "bt"
        instrument_type.save()
        executed = client.execute('''
                                    query {
                                        instrumentTypes
                                        (
                                            name: "%s",
                                            desc: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (instrument_type.name,
                                           instrument_type.description))
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('instrumentTypes', "
                          "[OrderedDict([("
                          "'name', '%s')])])])}" % instrument_type.name)

    def test_query_type_id(self):
        client = Client(schema)
        instrument_type = self.instrument_types[0]
        executed = client.execute('''
                                    query {
                                        instrumentTypes
                                        (
                                            instrumentTypeId: %s
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % instrument_type.id)
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('instrumentTypes', "
                          "[OrderedDict([("
                          "'name', '%s')])])])}" % instrument_type.name)

    def test_query_system_name(self):
        client = Client(schema)
        instrument_system = self.instrument_systems[0]
        executed = client.execute('''
                                    query {
                                        instrumentSystems
                                        (
                                            name: "%s"
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % instrument_system.name)
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('instrumentSystems', "
                          "[OrderedDict([("
                          "'name', '%s')])])])}" % instrument_system.name)

    def test_query_system_id(self):
        client = Client(schema)
        instrument_system = self.instrument_systems[0]
        executed = client.execute('''
                                    query {
                                        instrumentSystems
                                        (
                                            instrumentSystemId: %s
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % instrument_system.id)
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('instrumentSystems', "
                          "[OrderedDict([("
                          "'name', '%s')])])])}" % instrument_system.name)

    def test_create_correct(self):
        client = Client(schema)
        new_name = 'Test-Name'
        instrument_system = self.instrument_systems[0]
        instrument_type = self.instrument_types[0]
        label = Label()
        label.label = "boomerang"
        label.unique_label = "boomerang"
        label.description = "tori"
        label.save()
        executed = client.execute('''
                                    mutation {
                                        createInstrument
                                        (
                                            name: "%s",
                                            lat: 2.0,
                                            lng: 2.0,
                                            instrumentSystemId: %s,
                                            instrumentTypeId: %s,
                                            labels: {label:
                                            "%s", description: "%s"}
                                        )
                                        {
                                            name
                                        }
                                    }
                                    ''' % (new_name, instrument_system.id,
                                           instrument_type.id,
                                           label.unique_label,
                                           label.description))
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('createInstrument', "
                          "OrderedDict([('name', '%s')]))])}" % new_name)

    def test_update(self):
        client = Client(schema)
        new_name = 'Test-Name'
        lat = 3.666
        lng = 3.666
        description = 'Test-Desc'
        instrument_system = self.instrument_systems[1]
        instrument_type = self.instrument_types[1]
        instrument = self.instruments[0]
        label = Label()
        label.label = "boomerang"
        label.unique_label = "boomerang"
        label.description = "tori"
        label.save()
        executed = client.execute('''
                                    mutation {
                                        updateInstrument
                                        (
                                            id: %s,
                                            name: "%s",
                                            lat: %s,
                                            lng: %s,
                                            description: "%s",
                                            instrumentSystemId: %s,
                                            instrumentTypeId: %s,
                                            labels: {label:
                                            "%s", description: "%s"}
                                        )
                                        {
                                            description
                                        }
                                    }
                                    ''' % (instrument.id, new_name, lat,
                                           lng, description,
                                           instrument_system.id,
                                           instrument_type.id,
                                           label.unique_label,
                                           label.description))
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('updateInstrument', "
                          "OrderedDict([('description', '%s')]))])}"
                          % description)

    def test_update_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                    mutation {
                                        updateInstrument
                                        (
                                            id: -99
                                        )
                                        {
                                            description
                                        }
                                    }
                                    ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Instrument with id = -99 does not exist!")

    def test_delete(self):
        client = Client(schema)
        instrument = self.instruments[0]
        executed = client.execute('''
                                    mutation {
                                        deleteInstrument
                                        (
                                            id: %s,
                                        )
                                        {
                                            id
                                        }
                                    }
                                    ''' % instrument.id)
        self.assertEquals(str(executed),
                          "{'data': OrderedDict([('deleteInstrument',"
                          " None)])}")

    def test_delete_exception(self):
        client = Client(schema)
        executed = client.execute('''
                                mutation {
                                    deleteInstrument
                                    (
                                        id: -99,
                                    )
                                    {
                                        id
                                    }
                                }
                                ''')
        self.assertEqual(executed['errors'][0]['message'],
                         "Instrument with id = -99 does not exist!")
