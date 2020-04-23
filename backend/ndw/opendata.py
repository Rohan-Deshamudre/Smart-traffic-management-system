from ndw.datex_ii.endpoints import actuele_statusberichten, trafficspeed, \
    measurement_table

road_status = {}


def fetch_table():
    measurement_table.refresh()
    measurement_table.store()
    print('updated table')


def fetch_ndw():
    print('fetch')
    actuele_statusberichten.refresh()
    trafficspeed.refresh()
    actuele_statusberichten.store(road_status)
    trafficspeed.store(road_status)
    print('updated')


def get_status():
    global road_status
    return road_status
