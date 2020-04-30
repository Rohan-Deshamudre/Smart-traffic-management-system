from api.instruments.instrument_actions.models import InstrumentAction
from api.instruments.methods.getter import get_instrument_with_id
from api.instruments.models import InstrumentToLabel


def delete_instrument(instrument_id: int):
    instrument = get_instrument_with_id(instrument_id)
    InstrumentAction.objects.filter(instrument_id=instrument.id).delete()
    InstrumentToLabel.objects.filter(instrument_id=instrument.id).delete()
    instrument.delete()
