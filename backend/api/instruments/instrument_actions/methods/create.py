import graphene

from api.instruments.instrument_actions.methods.update import \
    replace_instrument_action_routes
from api.instruments.instrument_actions.models import InstrumentAction
from api.instruments.methods.getter import get_instrument_with_id
from api.routes.input_object import RouteInputObject


def create_instrument_action(instrument_id: int, text: str, description: str,
                             routes: graphene.List(
                                 RouteInputObject)) -> InstrumentAction:
    instrument = get_instrument_with_id(instrument_id)
    instrument_action = InstrumentAction(instrument=instrument, text=text,
                                         description=description)
    instrument_action.save()

    if routes:
        replace_instrument_action_routes(instrument_action, routes)
    return instrument_action
