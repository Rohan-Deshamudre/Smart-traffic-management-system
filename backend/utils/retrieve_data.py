import requests
from datetime import datetime, timedelta

from scenwise_backend.settings import SMARTROADS_API


def get_traffic_flow(site_id, start_date=datetime.utcnow()):
    speed_flow = get_speed_flow(site_id, start_date)
    return speed_flow['flow'] if speed_flow is not None else None


def get_traffic_speed(site_id, start_date=datetime.utcnow()):
    speed_flow = get_speed_flow(site_id, start_date)
    return speed_flow['speed'] if speed_flow is not None else None


def get_speed_flow(site_id,
                   start_date=datetime.utcnow(),
                   delta=4,
                   max_retry=4):
    """
    The api may not have data ready by the minute so we retry with exponentially
    longer intervals until we retrieve available data.
    """
    start_date -= timedelta(minutes=delta)
    data = {
        "start": [ start_date.isoformat()+"Z" ],
        "end": [ (start_date + timedelta(seconds=60)).isoformat()+"Z" ],
        "siteId": site_id,
        "nsamples": 1
    }

    r = post_request(SMARTROADS_API['SPEED_FLOW_API'], data)
    json_decoded = r.json()
    if r.ok and len(json_decoded['speedFlows']) > 0:
        return json_decoded['speedFlows'][0]
    elif max_retry > 0:
        return get_speed_flow(site_id, start_date, delta * 2, max_retry - 1)
    else:
        return None


def get_travel_time(coords,
                    start_date=datetime.utcnow(),
                    delta=4,
                    max_retry=4):
    """
    The api may not have data ready by the minute so we retry with exponentially
    longer intervals until we retrieve available data.
    """
    start_date -= timedelta(minutes=delta)
    data = {
        'start' : start_date.isoformat()+"Z",
        'end' : (start_date + timedelta(seconds=60)).isoformat()+"Z",
        'type' : 'SPEED',
        'coordinates' : coords
    }

    r = post_request(SMARTROADS_API['TRAVEL_TIME_API'], data)
    json_decoded = r.json()
    if r.ok and len(json_decoded['measurementsPerTime']) > 0:
        return json_decoded['measurementsPerTime'][0]['values']
    elif max_retry > 0:
        return get_travel_time(coords, start_date, delta * 2, max_retry - 1)
    else:
        return None


def post_request(url, json):
    return requests.post(url, json=json, headers=SMARTROADS_API['headers'])
