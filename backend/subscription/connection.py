from datetime import datetime

import pytz
import json

from api.exception.api_exception import ApiException
from api.road_segments.methods.getter import get_road_segment_with_id
from api.routes.methods import get_float_array
from api.simulations.compression import simulation_id_to_json
from api.simulations.methods.create import (
    create_simulation_scene,
    create_simulation_scene_event,
)
from api.simulations.models import SimulationScene
from ndw import opendata
from ndw.datex_ii.endpoints.message_object import val_key, loc_key
from subscription.messenger import (
    send_disc_message_to_channel,
    send_con_message_to_channel,
    send_message_to_channel,
)
from subscription.object.methods import (
    create_subscriber_object,
    get_sim_id,
    get_road_segments,
    get_channel,
    get_frame,
    set_frame,
    get_live_id,
)
from utils.route import (
    match,
    check_if_point_in_direction,
    check_if_point_in_direction_list,
)
from decision_support.response_plans import get_active_response_plans

subscribers = {}

message_type_key = "type"


def connect_subscriber(reply_channel):
    # ASGI WebSocket packet-received and send-packet message types
    # both have a "text" key for their textual data.
    try:
        send_con_message_to_channel(reply_channel)
    except Exception as exc:
        print(str(exc))
        disconnect_in_subscribers(reply_channel)


def disconnect_subscriber(reply_channel):
    """
    Removes subscribers for the list of subscribers.
    :param reply_channel: The channel that is used to send messages.
    """
    try:
        send_disc_message_to_channel(reply_channel)
    except Exception as exc:
        print(str(exc))

    disconnect_in_subscribers(reply_channel)


def disconnect_in_subscribers(reply_channel):
    if reply_channel.name in subscribers:
        del subscribers[reply_channel.name]


def send_save_to_channel(reply_channel, msg):
    try:
        send_message_to_channel(reply_channel, msg)
    except Exception as exc:
        print(str(exc))
        disconnect_in_subscribers(reply_channel)


def handle_incoming_message(obj, reply_channel):
    """
    Handles message from the user.
    :param obj: Contains message data.
    :param reply_channel: The channel that is used to send messages.
    """
    if int(obj[message_type_key]) == 0:
        try:
            sub_obj = create_subscriber_object(reply_channel, obj)
            subscribers[reply_channel.name] = sub_obj
        except ApiException as exc:
            send_save_to_channel(reply_channel, str(exc))

    elif int(obj[message_type_key]) == 1:
        disconnect_subscriber(reply_channel)

    print("incoming_msg_handled")


def frame_messenger(subscriber_obj):
    """
    Sends every scene of the simulation stored in the database.
    """
    channel = get_channel(subscriber_obj)

    frame = get_frame(subscriber_obj)
    scenes = SimulationScene.objects.filter(simulation_id=get_sim_id(subscriber_obj))

    if frame < len(scenes):
        send_save_to_channel(channel, simulation_id_to_json(scenes[frame].id))
        set_frame(subscriber_obj, frame + 1)

    else:
        disconnect_subscriber(channel)


def live_messenger(subscriber_obj):
    """
    Retrieve response plan information for each road segment
    """
    road_segments = get_road_segments(subscriber_obj)
    sim_id = get_live_id(subscriber_obj)
    scene = create_simulation_scene(sim_id, datetime.now(pytz.utc).isoformat(), None)
    for road_segment_id, _ in road_segments.items():
        response_plan = get_active_response_plans(road_segment_id)
        create_simulation_scene_event(
            scene.id,
            road_segment_id,
            8, 0, json.dumps(response_plan)
        )

    send_save_to_channel(get_channel(subscriber_obj), simulation_id_to_json(scene.id))


def handle_send_messages():
    """
    Handles every subscriber and what simulation he requested.
    The frame is only used for simulations that are in the
    database. If the last frame is reached the
    client is disconnected from the WebSocket.
    """
    items = {k: v for k, v in subscribers.items() if v}
    for key in items:
        subscriber_obj = items[key]
        sim_id = get_sim_id(subscriber_obj)
        if sim_id and type(sim_id) is int:
            frame_messenger(subscriber_obj)
        elif sim_id and sim_id == "live":
            live_messenger(subscriber_obj)


# TODO: Refactor to use the api endpoint
def find(scene_id, road_segment_id, poly_lines):
    road_status = opendata.get_status()
    matches = []
    for road_condition_type_id, ndw_status in road_status.items():
        hits = 0
        road_condition_value = 0
        for i in ndw_status:
            if match(i[loc_key], poly_lines, 0.5):
                road_condition_value += i[val_key]
                hits += 1

                # points = get_float_array(get_road_segment_with_id(
                #     road_segment_id).route)

                # if check_if_point_in_direction_list(i[loc_key], points):
        if hits > 0:
            simulation_scene_event = create_simulation_scene_event(
                scene_id,
                road_segment_id,
                road_condition_type_id,
                int(road_condition_value / hits),
            )
            matches.append(simulation_scene_event)
    return matches
