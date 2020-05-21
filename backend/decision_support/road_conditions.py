from api.road_conditions.models import RoadCondition
from api.road_segments.methods.getter import (
    get_road_segment_with_road_condition_id,
    get_polylines_with_id,
)
from subscription.object.methods import create_road_segments
from utils.route import match
from .exceptions import NoMeasurementAvailableException
from ndw.opendata import get_status
from ndw.datex_ii.endpoints.message_object import loc_key, val_key


def is_road_condition_active(road_condition: RoadCondition):
    symbol = road_condition.value[0]
    target = road_condition.value[1:]

    _, measurements = get_status().items()

    closest_measurement = find_closest_measurement_for_road_condition(
        measurements, road_condition.id
    )

    return interp(closest_measurement[val_key], symbol, target)

    # >120

    # [0] -> either < or >
    # [1] -> speed in km/h


def interp(speed, symbol, target):
    if symbol == "<":
        return speed < target
    if symbol == ">":
        return speed > target

    raise InvalidValueException(symbol)


def find_closest_measurement_for_road_condition(measurements, road_condition_id):
    segment = get_road_segment_with_road_condition_id(road_condition_id)
    polylines = get_polylines_with_id(segment.id)

    closest_measurement = None
    distance = -1

    for measurement in measurements:
        matches = match(measurement[loc_key], polylines, 10)
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

    return closest_measurement
