msg_key = "msg"
loc_key = "loc"
val_key = "val"
typ_key = "typ"

spd_typ = "s"
int_typ = "i"


def create_message_object(loc, val: int = 10, typ: str = spd_typ, msg: str = ""):
    return {msg_key: msg, loc_key: loc, val_key: val, typ_key: typ}
