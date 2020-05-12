from api.exception.api_exception import ApiException


class ResponsePlanIsSameAsParentException(ApiException):
    def __init__(self):
        self.message = "Response Plan is same as parent folder"

class ResponsePlanChildrenAsParentException(ApiException):
    def __init__(self, response_plan_id: int, parent_id: int):
        self.message = "Can't set response plan with id = %s " \
                       " as children of response plan with id = %s" % (
                           response_plan_id, parent_id)
