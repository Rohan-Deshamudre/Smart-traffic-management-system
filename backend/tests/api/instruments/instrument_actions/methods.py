from typing import List

from api.instruments.instrument_actions.models import InstrumentAction
from api.instruments.models import Instrument


def create_instrument_actions(instruments: List[Instrument]) \
        -> List[InstrumentAction]:
    instrument_actions = []
    for x in range(len(instruments)):
        instrument_action = InstrumentAction(instrument=instruments[x],
                                             description="desc")
        instrument_action.save()
        instrument_actions.append(instrument_action)
    return instrument_actions
