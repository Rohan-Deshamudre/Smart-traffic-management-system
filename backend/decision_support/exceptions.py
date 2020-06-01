class DecisionSupportException(Exception):
    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

    def __str__(self):
        return self.message


class InvalidResponsePlanException(DecisionSupportException):
    def __init__(self, response_plan_id: int):
        self.message = "Invalid response plan with id = %s " % response_plan_id


class NoMeasurementAvailableException(DecisionSupportException):
    def __init__(self):
        self.message = "No available measurement"
