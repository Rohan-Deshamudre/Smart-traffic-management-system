from api.instruments.instrument_actions.methods.getter import \
    get_instrument_action_with_id
from api.instruments.instrument_actions.models import InstrumentActionToRoute
from api.road_conditions.road_condition_actions.models import \
    RoadConditionActionToInstrumentAction


def delete_instrument_action(instrument_action_id):
    instrument_action = get_instrument_action_with_id(instrument_action_id)

    RoadConditionActionToInstrumentAction.objects.filter(
        instrument_action=instrument_action).delete()
    InstrumentActionToRoute.objects.filter(
        instrument_action=instrument_action).delete()
    instrument_action.delete()
