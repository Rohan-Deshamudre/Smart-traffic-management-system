import threading
import time


def decision_module(name):
    time.sleep(5)

    try:
        from decision_support.response_plans import check_road_segments
        from decision_support.site_id import fetch_shapefile
    except Exception as exc:
        raise exc
    fetch_shapefile()
    while True:
        check_road_segments()
        time.sleep(60)


def start():
    threading.Thread(target=decision_module, args=(1,)).start()
