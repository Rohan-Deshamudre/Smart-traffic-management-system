import json

from channels import route

from subscription.connection import handle_incoming_message, \
    connect_subscriber, disconnect_subscriber


def ws_connect(message):
    connect_subscriber(message.reply_channel)


def ws_message(message):
    """
    Handles every message that is send from the client the server.
    :param message: Allowed messages from the client are
    JSON objects with following params;
     type, simulation_id, road_segments.
    """
    handle_incoming_message(json.loads(message.content['text']),
                            message.reply_channel)


def ws_disconnect(message):
    disconnect_subscriber(message.reply_channel)


app_routing = [
    route("websocket.connect", ws_connect, path=r"^/subscriptions"),
    route("websocket.receive", ws_message, path=r"^/subscriptions"),
    route("websocket.disconnect", ws_disconnect, path=r"^/subscriptions"),
]
