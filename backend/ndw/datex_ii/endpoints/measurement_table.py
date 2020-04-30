import xml.etree.ElementTree as ET

from ndw.database.measurement_site.methods import create_measurement_site
from ndw.datex_ii import meta
from ndw.datex_ii.location import Locations
from utils import xml_zipper

end_point = 'measurement'


def refresh():
    xml_zipper.get(meta.URL, end_point, meta.FILE_LOC)


def store():
    handle_measurement_table(
        ET.parse(xml_zipper.getXML(meta.FILE_LOC, end_point)).getroot())


def handle_measurement_table(root):
    for measurement in root.findall(meta.MEASUREMENT_TABLE_PINPOINT):
        measurement_id = measurement.get('id')
        version = int(measurement.get('version'))
        indices = []
        loc = Locations.handle_location(
            measurement.find('{%s}measurementSiteLocation' % meta.XML_DATEX))

        for characteristic in measurement.findall(
                '{%s}measurementSpecificCharacteristics' % meta.XML_DATEX):
            index = characteristic.get('index')
            vehicleType = characteristic.find(
                '{%s}measurementSpecificCharacteristics/{%s}'
                'specificVehicleCharacteristics/{%s}vehicleType' % (
                    meta.XML_DATEX, meta.XML_DATEX, meta.XML_DATEX))
            if vehicleType is not None:
                if vehicleType.text == 'anyVehicle':
                    indices.append(int(index))
        create_measurement_site(measurement_id, version, loc, indices)
