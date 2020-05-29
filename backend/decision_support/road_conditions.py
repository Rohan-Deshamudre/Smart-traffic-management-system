import datetime
import time
from api.road_conditions.models import RoadCondition
from api.road_segments.methods.getter import (
    get_road_segment_with_road_condition_id,
    get_polylines_with_id,
)
from subscription.object.methods import create_road_segments
from utils.route import match
from .exceptions import NoMeasurementAvailableException
from utils.retrieve_data import get_traffic_flow, get_traffic_speed, \
    get_travel_time


int_typ = "i"
spd_typ = "s"
wkd_typ = "w"
tim_typ = "t"


def is_road_condition_active(road_condition: RoadCondition):
    # TODO: replace with multiple db columns?
    symbol = road_condition.value[0]
    target = road_condition.value[1:-1]
    con_type = road_condition.value[-1]

    if con_type == wkd_typ:
        interp(datetime.datetime.today().weekday(), symbol, target)
    elif con_type == tim_typ:
        interp(int(time.time()), symbol, target)
    elif con_type == int_typ:
        # TODO: Retrieve correct siteId
        interp(get_traffic_flow("RWS01_MONIBAS_0041hrl0559ra"), symbol, target)
    elif con_type == spd_typ:
        # TODO: Retrieve correct siteId
        interp(get_traffic_speed("RWS01_MONIBAS_0041hrl0559ra"), symbol, target)

    return interp(closest_measurement[val_key], symbol, target)

    # i -> intensity
    # s -> speed
    # w -> weekend?
    # t -> time (format: ?)


def interp(value, symbol, target):
    # API may return None in case no data is found
    if value is None:
        raise NoMeasurementAvailableException()

    if symbol == "<":
        return value < target
    if symbol == ">":
        return value > target

    raise InvalidValueException(symbol)
