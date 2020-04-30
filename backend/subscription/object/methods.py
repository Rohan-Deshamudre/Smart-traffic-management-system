from datetime import datetime

import pytz

from api.road_segments.methods.getter import get_road_segment_with_id
from api.simulations.methods.create import create_simulation
from subscription.object.exception import MapboxFetchException
from utils.mapbox import get_polylines

sim_id_key = 'simulation_id'

channel_key = 'channel'
simulation_key = 'simulation'

id_key = 'id'
live_key = 'live_id'
frame_key = 'frame'
road_segments_key = 'road_segments'


def get_channel(subscriber_obj):
    return subscriber_obj[channel_key]


def get_sim_id(subscriber_obj) -> int:
    return subscriber_obj[simulation_key][id_key]


def get_live_id(subscriber_obj) -> int:
    return subscriber_obj[simulation_key][live_key]


def get_simulation(subscriber_obj) -> int:
    return subscriber_obj[simulation_key]


def get_road_segments(subscriber_obj):
    return subscriber_obj[simulation_key][road_segments_key]


def get_frame(subscriber_obj) -> int:
    return subscriber_obj[simulation_key][frame_key]


def set_frame(subscriber_obj, frame: int):
    subscriber_obj[simulation_key][frame_key] = frame


def create_subscriber_object(reply_channel, message_obj):
    """
    Adds an object to the list of subscribers.
    :param reply_channel: The channel that is used to send messages.
    :param message_obj: Message that contains the type of simulation request.
    """
    road_segments = {} if road_segments_key not in message_obj else \
        create_road_segments(
            message_obj[road_segments_key])
    sim_id = message_obj[sim_id_key]
    simulation = create_simulation_object(sim_id, road_segments)
    subscription = {channel_key: reply_channel, simulation_key: simulation}

    return subscription


def create_simulation_object(sim_id, road_segments):
    live_id = -1
    if sim_id == "live":
        description = ("Live simulation on %s with road_segments %s" % (
            datetime.now(), road_segments.keys()))
        name = ("Recorded live simulation %s" % str(
            datetime.now(pytz.utc).isoformat()))

        simulation = create_simulation(name, description)
        live_id = simulation.id
    return {id_key: sim_id, live_key: live_id, frame_key: 0,
            road_segments_key: road_segments}


def create_road_segments(road_segments):
    """
    Stores all polylines of the road_segments given
    :param road_segments: Road segments which  polylines should be used.
    """
    rs_map = {}
    for road_segment_id in road_segments:
        road_segment = get_road_segment_with_id(road_segment_id)
        if road_segment.route.id:
            route_points = road_segment.route.route_points.all()
            try:
                rs_map[road_segment_id] = get_polylines(route_points)
            except ConnectionError as err:
                raise MapboxFetchException()

    return rs_map
