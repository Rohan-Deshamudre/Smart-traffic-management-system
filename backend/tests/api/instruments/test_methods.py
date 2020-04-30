from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException
from api.instruments.methods.create import create_instrument
from api.instruments.methods.getter import get_instrument_with_id, \
    has_instrument_with_id, get_instrument_type, \
    has_instrument_type_with_id, get_instrument_type_with_name, \
    has_instrument_type_with_name, \
    get_instrument_system_with_id, has_instrument_system_with_id
from api.instruments.methods.update import update_instrument
from api.labels.models import Label
from tests.api.instruments.methods import create_instrument_types, \
    create_instrument_systems, create_instruments


class InstrumentMethodsTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.instrument_types = create_instrument_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.instrument_systems = create_instrument_systems([
            'Test-Sys-1', 'Test-Sys-2', 'Test-Sys-3'])
        self.instruments = create_instruments([
            'Test-Instr-1', 'Test-Instr-2', 'Test-Instr-3'],
            self.instrument_types[0], self.instrument_systems[0])

    def test_has_and_get_instrument(self):
        instrument = self.instruments[0]
        getter_instrument = get_instrument_with_id(instrument.id)
        self.assertEqual(instrument, getter_instrument)
        self.assertTrue(has_instrument_with_id(instrument.id))

    def test_get_instrument_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_instrument_with_id(-1)

    def test_has_and_get_instrument_type_id(self):
        instrument_type = self.instrument_types[0]
        getter_instrument_type = get_instrument_type(instrument_type.id)
        self.assertEqual(instrument_type, getter_instrument_type)
        self.assertTrue(has_instrument_type_with_id(instrument_type.id))

    def test_get_instrument_type_id_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_instrument_type(-1)

    def test_has_and_get_instrument_type_name(self):
        instrument_type = self.instrument_types[0]
        getter_instrument_type = get_instrument_type_with_name(
            instrument_type.name)
        self.assertEqual(instrument_type, getter_instrument_type)
        self.assertTrue(has_instrument_type_with_name(instrument_type.name))

    def test_get_instrument_type_name_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_instrument_type_with_name("tori boomerang")

    def test_has_and_get_instrument_system(self):
        instrument_system = self.instrument_systems[0]
        getter_instrument_type = get_instrument_system_with_id(
            instrument_system.id)
        self.assertEqual(instrument_system, getter_instrument_type)
        self.assertTrue(has_instrument_system_with_id(instrument_system.id))

    def test_get_instrument_system_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_instrument_system_with_id(-1)

    def test_update_instrument(self):
        instrument = self.instruments[0]
        updated_instrument = update_instrument(instrument.id, "bt", None, None,
                                               None, None, None, None)
        self.assertEqual("bt", updated_instrument.name)
