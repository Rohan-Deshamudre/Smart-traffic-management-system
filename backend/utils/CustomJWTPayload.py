def jwt_payload(user, context=None):
    username = user.get_username()
    groups = user.groups.all()

    if hasattr(username, 'pk'):
        username = username.pk

    payload = {
            user.USERNAME_FIELD: username,
            'exp': datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA,
            'groups': groups
            }

    if jwt_settings.JWT_ALLOW_REFRESH:
        payload['origIat'] = timegm(datetime.utcnow().utctimetuple())

    if jwt_settings.JWT_AUDIENCE is not None:
        payload['aud'] = jwt_settings.JWT_AUDIENCE

    if jwt_settings.JWT_ISSUER is not None:
        payload['iss'] = jwt_settings.JWT_ISSUER

    return payload
