from api.exception.api_exception import ObjectNotFoundException
from api.instruments.models import InstrumentType, InstrumentSystem, Instrument


def has_instrument_type_with_id(instrument_type_id: int) -> bool:
    return InstrumentType.objects.filter(id=instrument_type_id).exists()


def get_instrument_type(instrument_type_id: int) -> InstrumentType:
    if has_instrument_type_with_id(instrument_type_id):
        return InstrumentType.objects.get(id=instrument_type_id)

    raise ObjectNotFoundException('InstrumentType', 'id', instrument_type_id)


def has_instrument_type_with_name(instrument_name: str) -> bool:
    return InstrumentType.objects.filter(name=instrument_name).exists()


def get_instrument_type_with_name(instrument_name: str) -> InstrumentType:
    if has_instrument_type_with_name(instrument_name):
        return InstrumentType.objects.get(name=instrument_name)

    raise ObjectNotFoundException('InstrumentType', 'name', instrument_name)


def has_instrument_system_with_id(system_id: int) -> bool:
    return InstrumentSystem.objects.filter(id=system_id).exists()


def get_instrument_system_with_id(system_id: int) -> InstrumentSystem:
    if has_instrument_system_with_id(system_id):
        return InstrumentSystem.objects.get(id=system_id)

    raise ObjectNotFoundException('InstrumentSystem', 'id', system_id)


# ##################################################### #
#                     Instruments                       #
# ##################################################### #
def has_instrument_with_id(instrument_id: int) -> bool:
    return Instrument.objects.filter(id=instrument_id).exists()


def get_instrument_with_id(instrument_id: int) -> Instrument:
    if has_instrument_with_id(instrument_id):
        return Instrument.objects.get(id=instrument_id)

    raise ObjectNotFoundException('Instrument', 'id', instrument_id)
