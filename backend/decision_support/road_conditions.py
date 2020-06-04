import datetime
import time
from api.road_conditions.models import RoadCondition
from api.road_segments.models import RoadSegment
from api.routes.models import RouteSegment
from api.road_segments.methods.getter import (
    get_road_segment_with_road_condition_id,
    get_polylines_with_id,
)
from subscription.object.methods import create_road_segments
from utils.route import match
from .exceptions import NoMeasurementAvailableException
from api.road_conditions.exceptions import InvalidConditionException
from .site_id import fetch_site_id
from utils.retrieve_data import get_traffic_flow, get_traffic_speed, get_travel_time


int_typ = "i"
spd_typ = "s"
wkd_typ = "w"
tim_typ = "t"
trv_typ = "v"

# Grammar:
# i | < |  400            intensity smaller than 400
# w | > | 5               weekday greater than
# s | << | 10 | 20        speed between 10 and 20
# v | >< | 5 | 10         travel time lower than 5 or higher than 10

# i -> intensity
# s -> speed
# w -> weekday
# t -> time
# v -> travel time


def get_traffic_flow_from(road_segment: RoadSegment):
    measurements = []
    for seg in RouteSegment.objects.filter(route=road_segment.route).all():
        segment = fetch_site_id(seg)
        measurements.append(get_traffic_flow(segment.site_id))

    return max(measurements) if len(measurements) > 0 else 0


def get_traffic_speed_from(road_segment: RoadSegment):
    measurements = []
    for seg in RouteSegment.objects.filter(route=road_segment.route).all():
        segment = fetch_site_id(seg)
        measurements.append(get_traffic_speed(segment.site_id))

    return max(measurements) if len(measurements) > 0 else 0


def get_travel_time_from(road_segment: RoadSegment):
    coordinates = []
    for seg in RouteSegment.objects.filter(route=road_segment.route).all():
        segment = fetch_site_id(seg)
        coordinates.append({"latitude": segment.lat, "longitude": segment.lng})

    return max(get_travel_time(coordinates)) if len(coordinates) > 0 else 0


def is_road_condition_active(road_condition: RoadCondition,
                             road_segment: RoadSegment):
    parts = road_condition.value.split("|")

    if len(parts) < 3 or not parts[2].strip().isdigit() or (len(parts) > 3 and not parts[3].strip().isdigit()):
        raise InvalidConditionException(road_condition.value, road_condition.id)

    con_type = parts[0].strip()
    symbol = parts[1].strip()
    target1 = int(parts[2].strip())
    target2 = None if len(parts) < 4 else int(parts[3].strip())

    value = None

    if con_type == wkd_typ:
        value = datetime.datetime.today().weekday()
    elif con_type == tim_typ:
        value = int(time.time())
    elif con_type == int_typ:
        value = get_traffic_flow_from(road_segment)
    elif con_type == spd_typ:
        value = get_traffic_speed_from(road_segment)
    elif con_type == trv_typ:
        value = get_travel_time_from(road_segment)

    if value is None:
        raise InvalidConditionException(road_condition.value, road_condition.id)

    result = interp(value, symbol, target1, target2)
    description = get_description(con_type, result, value, symbol, target1, target2)

    if result is None:
        raise InvalidConditionException(road_condition.value, road_condition.id)

    return result, description


def interp(value, symbol, target1, target2):
    # API may return None in case no data is found
    if value is None:
        raise NoMeasurementAvailableException()

    if symbol == "<" and not target2:
        return value < target1
    if symbol == ">" and not target2:
        return value > target1
    if symbol == "<<" and target2:
        return target1 < value and value < target2
    if symbol == "><" and target2:
        return target1 > value or value > target2

    return None


def get_description(typ, result, value, symbol, target1, target2):
    mapTypes = {
        int_typ: "Traffic Intensity",
        spd_typ: "Traffic Speed",
        wkd_typ: "Weekday",
        tim_typ: "Time",
        trv_typ: "Travel Time"
    }

    symbolTypes = {
        "<": "less than",
        ">": "greater than",
        "<<": "in between",
        "><": "outside"
    }

    description = "The value of %s is %s and it is %s %s %s %s" % (
        mapTypes[typ],
        value,
        "" if result else "not",
        symbolTypes[symbol],
        target1,
        targets if target2 else ""
    )

    return description
