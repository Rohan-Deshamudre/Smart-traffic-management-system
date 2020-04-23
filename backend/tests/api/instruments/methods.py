from typing import List

from api.instruments.models import InstrumentSystem, Instrument, InstrumentType


def create_instrument_systems(names: List[str]) -> List[InstrumentSystem]:
    instrument_systems = []
    for name in names:
        instrument_system = InstrumentSystem(name=name)
        instrument_system.save()
        instrument_systems.append(instrument_system)
    return instrument_systems


def create_instrument_types(names: List[str]) -> List[InstrumentType]:
    instrument_types = []
    for name in names:
        instrument_type = InstrumentType(name=name)
        instrument_type.save()
        instrument_types.append(instrument_type)
    return instrument_types


def create_instruments(names: List[str], instrument_type: InstrumentType,
                       instrument_system: InstrumentSystem) \
        -> List[Instrument]:
    instruments = []

    for name in names:
        instrument = Instrument(name=name, lat=1, lng=1,
                                instrument_type=instrument_type,
                                instrument_system=instrument_system)
        instrument.save()
        instruments.append(instrument)
    return instruments
