from api.instruments.methods.getter import get_instrument_type, \
    get_instrument_system_with_id
from api.instruments.models import Instrument, InstrumentToLabel
from api.labels.input_object import LabelArrayInputObject
from api.labels.methods import create_label


def create_instrument(name: str, instrument_type_id: int, lat: float,
                      lng: float, instrument_system_id: int, description: str,
                      labels: LabelArrayInputObject = []) -> Instrument:
    instrument_type = get_instrument_type(instrument_type_id)
    instrument_system = get_instrument_system_with_id(instrument_system_id)

    instrument = Instrument(name=name, instrument_type=instrument_type,
                            lat=lat, lng=lng,
                            instrument_system=instrument_system,
                            description=description)

    instrument.save()
    for l in labels:
        InstrumentToLabel(instrument=instrument, label=create_label(l)).save()

    return instrument
