msg_key = 'msg'
loc_key = 'loc'
val_key = 'val'


def create_message_object(loc, val: int = 10, msg: str = ''):
    return {msg_key: msg, loc_key: loc, val_key: val}
