from api.instruments.methods.getter import get_instrument_with_id, \
    get_instrument_system_with_id, get_instrument_type
from api.instruments.models import Instrument, InstrumentToLabel
from api.labels.input_object import LabelArrayInputObject
from api.labels.methods import create_label


def update_instrument(instrument_id: int, name: str, lat: float, lng: float,
                      description: str,
                      instrument_system_id: int, instrument_type_id: int,
                      labels: LabelArrayInputObject) -> Instrument:
    instrument = get_instrument_with_id(instrument_id)

    instrument.name = name if name else instrument.name
    instrument.lat = lat if lat else instrument.lat
    instrument.lng = lng if lng else instrument.lng
    instrument.description = description \
        if description else instrument.description
    if instrument_system_id:
        instrument.instrument_system = get_instrument_system_with_id(
            instrument_system_id)
    if instrument_type_id:
        instrument.instrument_type = get_instrument_type(instrument_type_id)
    instrument.save()

    if labels:
        InstrumentToLabel.objects.filter(instrument_id=instrument.id).delete()
        for l in labels:
            InstrumentToLabel(instrument=instrument,
                              label=create_label(l)).save()
    return instrument
