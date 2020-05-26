from api.road_conditions.methods.getter import get_road_condition_type_with_name
import xml.etree.ElementTree as ET
from ndw.database.measurement_site.model import MeasurementSite
from ndw.database.measurement_site.methods import get_location
from ndw.database.measurement_site.methods import get_indices

from ndw.datex_ii.endpoints.message_object import create_message_object
from ndw.datex_ii.measurement import Measurement
from ndw.datex_ii import meta
from utils import xml_zipper

from ndw.datex_ii.endpoints.message_object import spd_typ, int_typ

end_point = "trafficspeed"


def refresh():
    xml_zipper.get(meta.URL, end_point, meta.FILE_LOC)


def store(road_store):
    parsed = ET.parse(xml_zipper.getXML(meta.FILE_LOC, end_point))
    handle_measurement(parsed.getroot(), road_store)


def handle_measurement(root, status):
    values = []
    for measurement in root.findall(meta.MEASUREMENT_PINPOINT):
        site_ref = measurement.find("{%s}measurementSiteReference" % meta.XML_DATEX)
        measurement_site = MeasurementSite.objects.filter(
            name=site_ref.get("id")
        ).first()

        loc = get_location(measurement_site)
        indices = get_indices(measurement_site)

        spd_hits = 0
        spd_site_value = 0

        int_hits = 0
        int_site_value = 0

        for measure_value in measurement.findall("{%s}measuredValue" % meta.XML_DATEX):
            if int(measure_value.get("index")) in indices:
                # Get average traffic speed out of data
                typ, value = Measurement.handle_measurement_type(measure_value)
                if typ == spd_typ:
                    if value > 0:
                        spd_site_value += value
                        spd_hits += 1
                if typ == int_typ:
                    if value > 0:
                        int_site_value += value
                        int_hits += 1

        if spd_hits > 0:
            print("sped")
            # take the average speed of average speeds of location
            values.append(
                create_message_object(loc, int(spd_site_value / spd_hits), spd_typ)
            )

        if int_hits > 0:
            print("int")
            # take the average intensity
            values.append(
                create_message_object(loc, int(int_site_value / int_hits), int_typ)
            )

    status[get_road_condition_type_with_name("Congestion").id] = values
