import graphene

from api.routes.input_object import RouteInputObject
from api.routes.models import Route, RouteSegment


def get_float_array(route: Route):
    floats = []
    segments = RouteSegment.objects.filter(route_id=route.id).all()
    for i in segments:
        floats.append([float(i.lng), float(i.lat)])
    return floats


def create_route(route_points: RouteInputObject) -> Route:
    route = Route()
    route.save()
    i = 1
    for p in route_points:
        RouteSegment(route=route, segment=i, lat=p.lat, lng=p.lng).save()
        i += 1

    return route


def delete_route(route_id: int):
    RouteSegment.objects.filter(route_id=route_id).delete()
    Route.objects.filter(id=route_id).delete()


def delete_routes(route_ids: graphene.List(graphene.Int)):
    for route_id in route_ids:
        delete_route(route_id)
