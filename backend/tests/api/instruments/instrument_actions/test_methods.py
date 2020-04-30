from django.test import TestCase

from api.exception.api_exception import ObjectNotFoundException
from api.instruments.instrument_actions.methods.create import \
    create_instrument_action
from api.instruments.instrument_actions.methods.getter import \
    get_instrument_action_with_id
from api.instruments.instrument_actions.methods.update import \
    update_instrument_action
from api.routes.input_object import RoutePoint
from tests.api.instruments.instrument_actions.methods import \
    create_instrument_actions
from tests.api.instruments.methods import create_instrument_types, \
    create_instrument_systems, create_instruments


class InstrumentActionMethodsTest(TestCase):
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

    def test_get_instrument_action_exception(self):
        with self.assertRaises(ObjectNotFoundException):
            get_instrument_action_with_id(-1)

    def test_create_instrument_action(self):
        instrument = self.instruments[0]
        point = RoutePoint()
        point.lat = 0.0
        point.lng = 1.1
        route = [point]
        instrument_action = create_instrument_action(instrument.id,
                                                     "tekst", "kar",
                                                     [route])
        self.assertEqual(instrument.id, instrument_action.instrument.id)

    def test_update_instrument_action(self):
        instrument_action = self.instrument_actions[0]
        updated_instrument_action = update_instrument_action(
            instrument_action.id, None, "tekst", "kar", None)
        self.assertEqual(updated_instrument_action.text, "tekst")
        self.assertEqual(updated_instrument_action.description, "kar")
