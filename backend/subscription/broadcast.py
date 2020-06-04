import threading
import time


def broadcast_message(name):
    time.sleep(5)

    try:
        from subscription.connection import handle_send_messages
    except Exception as exc:
        raise exc
    while True:
        handle_send_messages()
        time.sleep(60)


def start():
    threading.Thread(target=broadcast_message, args=(1,)).start()
