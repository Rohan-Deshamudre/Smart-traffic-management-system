def has_perms(user, permissionsArray, requireLogin=True):
    if requireLogin and user.is_anonymous:
        raise Exception('Not logged in')

    for perm in permissionsArray:
        if not user.has_perm(perm):
            raise Exception('Missing permission: ' + perm)
