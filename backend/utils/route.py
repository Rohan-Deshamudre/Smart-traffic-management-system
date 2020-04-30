from math import sin, cos, sqrt, atan2, radians, acos, pi

from utils.mapbox import get_polylines_from_array


def distance_meters(A, B):
    """
    Calculates distance between two coordinates in meters
    :param A: [lng, lat]
    :param B: [lng, lat]
    :return:
    """
    # approximate radius of earth in km
    R = 6373.0

    lat1 = radians(A[1])
    lon1 = radians(A[0])
    lat2 = radians(B[1])
    lon2 = radians(B[0])

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c * 1000


def check_if_point_in_direction_list(point, point_set):
    if type(point[0]) == list:
        for coord in point:
            if check_if_point_in_direction_list(coord, point_set):
                return True
        return False

    for i in range(len(point_set) - 1):
        if check_if_point_in_direction(point, point_set[i], point_set[i + 1]):
            return True

    return False


def check_if_point_in_direction(point, start, end, max_diversion=1):
    normal_section = get_polylines_from_array([start, end])
    diversion_section = get_polylines_from_array([start, point, end])
    diff = [x for x in diversion_section if x not in normal_section]

    return len(diff) <= max_diversion


def match(point, polylines, max_dist_meters=1):
    """
    Calculates offset between point to polylines.
    Returns list of polylines sorted by offset.
    Best match is polyline with smallest offset
    :param point: [lng, lat]
    :param polylines: array of [lng, lat] sequences
    :param max_dist_meters: maximum offset in meters
    """

    matches = []
    if type(point[0]) == list:
        for coord in point:
            m = match(coord, polylines, max_dist_meters)
            if m:
                matches.append(m)
                break
        return matches

    for i in range(len(polylines) - 1):
        start = polylines[i]
        end = polylines[i + 1]
        vSE = Vector(end[0] - start[0], end[1] - start[1])
        vSP = Vector(point[0] - start[0], point[1] - start[1])
        angleSP = vSE.angle_degrees(vSP)
        if angleSP > 90:
            continue
        vES = vSE.scale(-1)
        vEP = Vector(point[0] - end[0], point[1] - end[1])
        angleEP = vES.angle_degrees(vEP)
        if angleEP > 90:
            continue

        L = distance_meters(start, end)
        dist_start = distance_meters(point, start)
        dist_end = distance_meters(point, end)
        dist_total = dist_start + dist_end
        if dist_total - L < max_dist_meters:
            matches.append({'index': i, 'polyline': polylines[i],
                            'offset': dist_total - L})
            break

    matches.sort(key=lambda x: x['offset'])
    return matches


class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.length = sqrt(x ** 2 + y ** 2)
        if self.length == 0:
            raise Exception("Vector of length 0")

    def dot(self, other):
        return self.x * other.x + self.y * other.y

    def angle_degrees(self, other):
        return self.angle(other) * (180 / pi)

    def angle_radians(self, other):
        return self.angle(other)

    def angle(self, other):
        return acos(self.dot(other) / (self.length * other.length))

    def rotate_ccw(self, radians):
        return Vector(self.x * cos(radians) - self.y * sin(radians),
                      self.x * sin(radians) + self.y * cos(radians))

    def scale(self, s):
        return Vector(self.x * s, self.y * s)
