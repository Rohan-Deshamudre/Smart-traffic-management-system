from api.exception.api_exception import ApiException


class MapboxFetchException(ApiException):
    def __init__(self, road_segment_id):
        self.message = "Could not get poly_lines from " \
                       "road_segment (%s) try again later" % road_segment_id
