import csv
import io

from django.test import TestCase

from api.instruments.compression import export_instruments, import_instruments
from api.instruments.models import Instrument
from tests.api.instruments.methods import create_instrument_types, \
    create_instrument_systems, create_instruments


class InstrumentCompressionTest(TestCase):
    databases = '__all__'

    def setUp(self):
        self.instrument_types = create_instrument_types([
            'Test-Type-1', 'Test-Type-2', 'Test-Type-3'])
        self.instrument_systems = create_instrument_systems([
            'Test-Sys-1', 'Test-Sys-2', 'Test-Sys-3'])
        self.instruments = create_instruments([
            'Test-Instr-1', 'Test-Instr-2', 'Test-Instr-3'],
            self.instrument_types[0], self.instrument_systems[0])

    def test_export(self):
        obj = io.StringIO()
        writer = csv.writer(obj, delimiter=';')
        i1 = Instrument.objects.get(id=self.instruments[0].id)
        i2 = Instrument.objects.get(id=self.instruments[1].id)
        export_instruments([i1.id, i2.id], writer)

        csv_string = "name;type;latitude;longitude;description\r\n" \
                     "%s;%s;%s;%s;%s\r\n%s;%s;%s;%s;%s\r\n" % \
                     (i1.name, i1.instrument_type.name, i1.lat, i1.lng,
                      "" if i1.description is None else i1.description,
                      i2.name, i2.instrument_type.name, i2.lat, i2.lng,
                      "" if i2.description is None else i2.description)

        self.assertEqual(obj.getvalue(), csv_string)

    def test_import_with_same_name(self):
        i1 = Instrument.objects.get(id=self.instruments[0].id)

        row = {
            'name': i1.name,
            'type': i1.instrument_type.name,
            'latitude': i1.lat,
            'longitude': i1.lng,
            'description': i1.description,
        }
        msg = import_instruments([row])
        self.assertEqual(msg['stored'], 0)

    def test_import_with(self):
        i1 = Instrument.objects.get(id=self.instruments[0].id)

        row = {
            'name': '%s-%s' % (i1.name, 1),
            'type': i1.instrument_type.name,
            'latitude': i1.lat,
            'longitude': i1.lng,
            'description': 'Description'
        }
        msg = import_instruments([row])
        self.assertEqual(msg['stored'], 1)
