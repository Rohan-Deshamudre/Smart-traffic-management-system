import graphene


class SimulationSceneEventInputObject(graphene.InputObjectType):
    road_segment_id = graphene.Int(required=True)
    road_condition_type_id = graphene.Int(required=True)
    value = graphene.Int(required=True)


class SimulationSceneInputObject(graphene.InputObjectType):
    time = graphene.DateTime(required=True)
    scene_events = \
        graphene.List(SimulationSceneEventInputObject, required=True)
