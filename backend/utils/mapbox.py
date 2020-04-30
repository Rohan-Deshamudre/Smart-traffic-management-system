from typing import List

from mapbox import Directions

from api.routes.models import RouteSegment

service = Directions(
    access_token="pk.eyJ1IjoidG5hYmVyIiwiYSI6ImNqbmN5Zm"
                 "V0ODBsdXAzcW1yanVkY2xoazMifQ.r9yIImJoKcOSVhhew00aBg")


def get_polylines_from_array(arrays: List[List[float]]):
    return list(dict.fromkeys(get_lines_array(arrays)))


def get_polylines(route_points):
    return list(dict.fromkeys(get_lines(route_points)))


def get_lines_array(floats: List[List[float]]):
    coordinates = []
    coords = []
    if len(floats) >= 2:
        for i in floats:
            origin = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': i
                }
            }
            coords.append(origin)
        response = service.directions(coords, 'mapbox/driving',
                                      overview='full')
        coordinates = \
            response.geojson()["features"][0]["geometry"]["coordinates"]
    return coordinates


def get_lines(pts: List[RouteSegment]):
    coordinates = []
    coords = []
    if len(pts) >= 2:
        for i in pts:
            origin = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [i.lng, i.lat]
                }
            }
            coords.append(origin)
        response = service.directions(coords, 'mapbox/driving',
                                      overview='full')
        coordinates = response.geojson()["features"][0]["geometry"][
            "coordinates"]
    return coordinates
