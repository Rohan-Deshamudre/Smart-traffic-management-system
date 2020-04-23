import json


def send_con_message_to_channel(reply_channel):
    send_message_to_channel(reply_channel, {'text': "CON OK"})


def send_disc_message_to_channel(reply_channel):
    send_message_to_channel(reply_channel, {'text': "DISC OK"})


def send_message_to_channel(reply_channel, msg):
    reply_channel.send({
        "text": json.dumps(msg),
    })
