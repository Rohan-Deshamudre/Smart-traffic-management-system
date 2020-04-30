from api.exception.api_exception import ObjectNotFoundException
from api.instruments.instrument_actions.models import InstrumentAction


def has_instrument_action_with_id(instrument_action_id: int) -> bool:
    return InstrumentAction.objects.filter(id=instrument_action_id).exists()


def get_all_instrument_actions():
    return InstrumentAction.objects.all()


def get_instrument_action_with_id(
        instrument_action_id: int) -> InstrumentAction:
    if has_instrument_action_with_id(instrument_action_id):
        return InstrumentAction.objects.get(id=instrument_action_id)

    raise ObjectNotFoundException("InstrumentAction", "id",
                                  instrument_action_id)
