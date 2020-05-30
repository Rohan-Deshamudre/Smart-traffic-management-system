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
from .site_id import fetch_site_id
from utils.retrieve_data import get_traffic_flow, get_traffic_speed, \
    get_travel_time


int_typ = "i"
spd_typ = "s"
wkd_typ = "w"
tim_typ = "t"
trv_typ = "v"


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
        coordinates.append({
            'latitude': segment.lat,
            'longitude': segment.lng
        })

    return max(get_travel_time(coordinates)) if len(coordinates) > 0 else 0


def is_road_condition_active(road_condition: RoadCondition,
                             road_segment: RoadSegment):
    # TODO: replace with multiple db columns?
    symbol = road_condition.value[0]
    target = road_condition.value[1:-1]
    con_type = road_condition.value[-1]

    if con_type == wkd_typ:
        interp(datetime.datetime.today().weekday(), symbol, target)
    elif con_type == tim_typ:
        interp(int(time.time()), symbol, target)
    elif con_type == int_typ:
        traffic_flow = get_traffic_flow_from(road_segment)
        interp(traffic_flow, symbol, target)
    elif con_type == spd_typ:
        traffic_speed = get_traffic_speed_from(road_segment)
        interp(traffic_speed, symbol, target)
    elif con_type = trv_typ:
        travel_time = get_travel_time_from(road_segment)
        interp(travel_time, symbol, target)
    
    return interp(closest_measurement[val_key], symbol, target)

    # i -> intensity
    # s -> speed
    # w -> weekend?
    # t -> time (format: ?)
    # v -> travel time

def interp(value, symbol, target):
    # API may return None in case no data is found
    if value is None:
        raise NoMeasurementAvailableException()

    if symbol == "<":
        return value < target
    if symbol == ">":
        return value > target

    raise InvalidValueException(symbol)
