import threading
import time
from datetime import datetime


def measurement_fetcher(name):
    time.sleep(5)

    try:
        from ndw.opendata import fetch_table
    except Exception as exc:
        raise exc
    while True:
        if datetime.today().hour == 13:
            fetch_table()
        time.sleep(3600)


def ndw_fetcher(name):
    time.sleep(5)

    try:
        from ndw.opendata import fetch_ndw
    except Exception as exc:
        raise exc
    while True:
        fetch_ndw()
        time.sleep(60)


def start_update():
    threading.Thread(target=ndw_fetcher, args=(1,)).start()


def start_daily_update():
    threading.Thread(target=measurement_fetcher, args=(1,)).start()
