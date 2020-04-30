from api.road_conditions.methods.getter import \
    get_road_condition_type_with_name
import xml.etree.ElementTree as ET

from ndw.datex_ii import meta
from ndw.datex_ii.endpoints.message_object import create_message_object
from ndw.datex_ii.location import Locations
from ndw.datex_ii.public_comment import PublicComment
from ndw.datex_ii.validity import Validity
from utils import xml_zipper

end_point = 'actuele_statusberichten'

accident_key = ['Accident']
event_key = ['PublicEvent']
road_work_key = ['MaintenanceWorks', 'ConstructionWorks']


def refresh():
    xml_zipper.get(meta.URL, end_point, meta.FILE_LOC)


def store(road_store):
    handle_situation_record(
        ET.parse(xml_zipper.getXML(meta.FILE_LOC, end_point)).getroot(),
        road_store)


def handle_situation_record(root, status):
    accidents = []
    events = []
    road_works = []
    for situation in root.findall(meta.SITUATION_RECORD_PINPOINT):
        tag = situation.get('{%s}type' % meta.XML_XMI)
        loc = Locations.handle_group_of_location(situation)
        is_valid = Validity.handle_duration(situation)

        obj = create_message_object(loc, msg=PublicComment.handle_comment(
            situation))
        if is_valid:
            if tag in accident_key:
                accidents.append(obj)
            elif tag in event_key:
                events.append(obj)
            elif tag in road_work_key:
                road_works.append(obj)
            else:
                pass
    status[get_road_condition_type_with_name('Accident').id] = accidents
    status[get_road_condition_type_with_name('Event').id] = events
    status[get_road_condition_type_with_name('Roadwork').id] = road_works
