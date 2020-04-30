class ApiException(Exception):

    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

    def __str__(self):
        return self.message


class ObjectNotFoundException(ApiException):
    def __init__(self, object_type: str, key: str, value: any):
        self.message = "%s with %s = %s does not exist!" % (
            object_type.capitalize(), key, value)


class ConstraintException(ApiException):
    def __init__(self, object_type: str, key: str, value: any):
        self.message = "%s with %s = %s already exists!" % (
            object_type.capitalize(), key, value)


class InvalidInputException(ApiException):
    def __init__(self):
        self.message = "Invalid input!"
