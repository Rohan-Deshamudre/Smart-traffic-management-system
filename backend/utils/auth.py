import sys
import os

from django.contrib.auth.models import Group
from graphql_jwt.decorators import user_passes_test


def engineer_required(fn=None):
    if "test" in sys.argv or os.getenv("ENV", "production") == "development":
        return fn

    decorator = user_passes_test(has_group_engineer)
    if fn:
        return decorator(fn)
    return decorator


def operator_required(fn=None):
    if "test" in sys.argv or os.getenv("ENV", "production") == "development":
        return fn

    decorator = user_passes_test(has_group_operator)
    if fn:
        return decorator(fn)
    return decorator


def has_group_engineer(user):
    return has_group(user, Group.objects.get(name="traffic_engineer").id)


def has_group_operator(user):
    # Traffic engineers are a proper subset of traffic operators.
    return has_group(
        user, Group.objects.get(name="traffic_operator").id
    ) or has_group_engineer(user)


def has_group(user, group_name):
    if "test" in sys.argv or os.getenv("ENV", "production") == "development":
        return True

    if user:
        if user.is_authenticated:
            return user.groups.filter(codename=group_name).exists()

    return False


def has_perms(info, permissionsArray, requireLogin=True):
    if "test" in sys.argv or os.getenv("ENV", "production") == "development":
        return True

    user = info.context.user

    if requireLogin and user.is_anonymous:
        raise Exception("Not logged in")

    for perm in permissionsArray:
        if not user.has_perm(perm):
            raise Exception("Missing permission: " + perm)

    return True
