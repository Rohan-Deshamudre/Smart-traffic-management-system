from typing import List

from ndw.database.location.model import Point, Location


def create_point(loc: Location, point: List[float], index: int = 0):
    Point(location=loc, index=index, lat=point[1], lng=point[0]).save()


def create_location_from_points(points):
    location = Location()
    location.save()
    if points:
        if type(points[0]) is list:
            for i in range(len(points)):
                create_point(location, points[i], i)
        if type(points[0]) is float:
            create_point(location, points)
    return location


def point_equals(a: Point, b: Point):
    return a.lat == b.lat and a.lng == b.lng and a.index == b.index


def location_equals(a: Location, b: Location):
    if len(a.points) == len(b.points):
        for i in range(len(a.points)):
            if not point_equals(a[i], b[i]):
                break

        return True
    return False


def get_points_from_location(location: Location):
    location_points = location.points.all()
    points = []
    if len(location_points) == 1:
        points.append(float(location_points[0].lng))
        points.append(float(location_points[0].lat))
    else:
        for point in location_points:
            points.append([float(point.lng), float(point.lat)])

    return points


def location_has_points(location: Location, points):
    location_points = location.points.all()

    if type(points[0]) is list:
        if len(points) == len(location_points):
            for i in range(len(points)):
                loc_point = location_points[i]
                new_point = points[i]

                if not float(loc_point.lat) == new_point[1] or not float(
                        loc_point.lng) == new_point[0]:
                    return False
            return True
    if type(points[0]) is float:
        loc_point = location_points[0]
        return len(location_points) == 1 and float(loc_point.lat) == points[
            1] and float(loc_point.lng) == points[0]
