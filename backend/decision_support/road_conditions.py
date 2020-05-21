from api.road_conditions.models import RoadCondition


def is_road_condition_active(road_condition: RoadCondition):
    parts = road_condition.value.split("|");

    return interp(parts[0], parts[1], parts[2])

    # switch op type (file)
    # skere custom syntax in value voor file lezen (new)
    # check of tijd/shit in custom syntax ook waar is
    # return true/false

    # >|10|t

    # [0] -> either < or >
    # [1] -> quantifier
    # [2] -> either t (time in minutes) or d (distance in metres)

def interp(symbol, quantifier, unit):
    if (unit == 't'):
        return interp_time(symbol, quantifier)
    if (unit == 'd'):
        return interp_time(symbol, quantifier)

def interp_time(symbol, quantifier):


def interp_distance(symbol, quantifier):
    return True;