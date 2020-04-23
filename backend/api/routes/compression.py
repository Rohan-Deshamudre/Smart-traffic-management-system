from api.routes.models import Route, RouteSegment

lat_key = 'lat'
lng_key = 'lng'


def to_json_route(route: Route):
    route_array = []
    points = route.route_points.all()

    for point in points:
        route_array.append(
            {lat_key: float(point.lat), lng_key: float(point.lng)})

    return route_array


def import_route(json_array):
    route = Route()
    route.save()

    i = 1
    for point in json_array:
        RouteSegment(route=route, segment=i, lat=point[lat_key],
                     lng=point[lng_key]).save()
        i += 1

    return route.id
