from api.instruments.instrument_actions.models import InstrumentAction
from api.road_conditions.road_condition_actions.models import \
    RoadConditionActionToInstrumentAction

id_key = 'id'


def to_json_instrument_action(instrument_action: InstrumentAction):
    instrument_action_object = {id_key: instrument_action.id}

    return instrument_action_object


def import_instrument_action(json_instrument_action, road_condition_action_id):
    RoadConditionActionToInstrumentAction(
        road_condition_action_id=road_condition_action_id,
        instrument_action_id=json_instrument_action[id_key]).save()
