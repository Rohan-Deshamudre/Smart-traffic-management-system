import sys
import os


def has_perms(info, permissionsArray, requireLogin=True):
    if 'test' in sys.argv or os.getenv('ENV', 'production') == 'development':
        return

    user = info.context.user

    if requireLogin and user.is_anonymous:
        raise Exception('Not logged in')

    for perm in permissionsArray:
        if not user.has_perm(perm):
            raise Exception('Missing permission: ' + perm)
