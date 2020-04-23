from api.exception.api_exception import ApiException


class NoParentDefinedForRoadCondition(ApiException):
    def __init__(self):
        self.message = "No parent defined!"


class ExceededRoadConditionChildDepth(ApiException):
    def __init__(self):
        self.message = "Road condition exceeded the amount of child depth"


class ExceededRoadConditionChildNumbers(ApiException):
    def __init__(self, from_id):
        self.message = \
            "Road condition %s already has a child road condition" % from_id


class CircularRoadCondition(ApiException):
    def __init__(self, from_id, to_id):
        self.message = \
            ("Road condition %s is a child of road condition %s" % (
                from_id, to_id))
