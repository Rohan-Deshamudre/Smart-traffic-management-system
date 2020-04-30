import graphene

from api.instruments.instrument_actions.methods.getter import \
    get_instrument_action_with_id
from api.instruments.instrument_actions.models import \
    InstrumentActionToRoute, InstrumentAction
from api.instruments.methods.getter import get_instrument_with_id
from api.routes.input_object import RouteInputObject
from api.routes.methods import create_route


def replace_instrument_action_routes(instrument_action: InstrumentAction,
                                     routes: graphene.List(RouteInputObject)):
    InstrumentActionToRoute.objects.filter(
        instrument_action_id=instrument_action.id).delete()
    for r in routes:
        route = create_route(r)
        InstrumentActionToRoute(instrument_action=instrument_action,
                                route=route).save()


def update_instrument_action(instrument_action_id: int, instrument_id: int,
                             text: str,
                             description: str,
                             routes: graphene.List(
                                 RouteInputObject)) -> InstrumentAction:
    instrument_action = get_instrument_action_with_id(instrument_action_id)

    if instrument_id:
        instrument_action.instrument = get_instrument_with_id(instrument_id)
    instrument_action.text = text if text else instrument_action.text
    instrument_action.description = description \
        if description else instrument_action.description

    instrument_action.save()

    if routes:
        replace_instrument_action_routes(instrument_action, routes)
    return instrument_action
