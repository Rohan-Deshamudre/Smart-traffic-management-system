from api.road_conditions.methods.getter import \
    get_road_condition_type_with_name
import xml.etree.ElementTree as ET
from ndw.database.measurement_site.model import MeasurementSite
from ndw.database.measurement_site.methods import get_location
from ndw.database.measurement_site.methods import get_indices

from ndw.datex_ii.endpoints.message_object import create_message_object
from ndw.datex_ii.measurement import Measurement
from ndw.datex_ii import meta
from utils import xml_zipper

end_point = 'trafficspeed'


def refresh():
    xml_zipper.get(meta.URL, end_point, meta.FILE_LOC)


def store(road_store):
    parsed = ET.parse(xml_zipper.getXML(meta.FILE_LOC, end_point))
    handle_measurement(parsed.getroot(), road_store)


def handle_measurement(root, status):
    speeds = []
    for measurement in root.findall(meta.MEASUREMENT_PINPOINT):
        site_ref = measurement.find(
            '{%s}measurementSiteReference' % meta.XML_DATEX)
        measurement_site = MeasurementSite.objects.filter(
            name=site_ref.get('id')).first()
        loc = get_location(measurement_site)
        indices = get_indices(measurement_site)

        hits = 0
        site_value = 0
        for measure_value in measurement.findall(
                '{%s}measuredValue' % meta.XML_DATEX):
            if int(measure_value.get('index')) in indices:
                value = Measurement.handle_measurement_type(measure_value)
                if value > 0:
                    site_value += value / 13
                    hits += 1

        if hits > 0:
            speeds.append(create_message_object(loc, int(site_value / hits)))

    status[get_road_condition_type_with_name('Congestion').id] = speeds
