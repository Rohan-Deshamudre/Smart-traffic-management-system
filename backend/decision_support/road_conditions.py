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
from ndw import opendata
from ndw.datex_ii.endpoints.message_object import loc_key, val_key, typ_key

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
    if con_type == tim_typ:
        interp(int(time.time()), symbol, target)
    if con_type == int_typ or con_type == spd_typ:
        interp(
            find_closest_measurement_for_road_condition(
                opendata.get_status()[road_condition.road_condition_type.id],
                road_condition.id,
                con_type,
            ),
            symbol,
            target,
        )

    return interp(closest_measurement[val_key], symbol, target)

    # <120s

    # i -> intensity
    # s -> speed
    # w -> weekend?
    # t -> time (format: ?)


def interp(value, symbol, target):
    if symbol == "<":
        return value < target
    if symbol == ">":
        return value > target

    raise InvalidValueException(symbol)


def find_closest_measurement_for_road_condition(
    measurements, road_condition_id, measurement_type
):
    segment = get_road_segment_with_road_condition_id(road_condition_id)
    polylines = get_polylines_with_id(segment.id)

    closest_measurement = None
    distance = -1
    i = 0

    for measurement in measurements:
        if measurement[typ_key] != measurement_type:
            continue
        i = i + 1
        print(closest_measurement, i)
        matches = match(measurement[loc_key], polylines)
        if matches:
            offset = matches[0]["offset"]
            if not closest_measurement:
                closest_measurement = measurement
                distance = offset
            elif offset < distance:
                closest_measurement = measurement
                distance = offset

    if distance == -1:
        raise NoMeasurementAvailableException(road_condition_id)

    print(closest_measurement)

    return closest_measurement
