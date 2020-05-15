import graphene
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from api.exception.api_exception import ApiException
from api.simulations.input_object import SimulationSceneInputObject, \
    SimulationSceneEventInputObject
from api.simulations.methods.create import create_simulation, \
    create_simulation_scene, create_simulation_scene_event
from api.simulations.methods.delete import delete_simulation, \
    delete_simulation_scene, delete_simulation_scene_event
from api.simulations.methods.update import update_simulation, \
    update_simulation_scene, update_simulation_scene_event

from .models import *

from utils.auth import has_perms


class SimulationTypeObject(DjangoObjectType):
    start_time = graphene.DateTime()
    end_time = graphene.DateTime()

    class Meta:
        model = Simulation

    def resolve_start_time(self, info):
        if self is not None and len(self.simulation_scenes.all()) > 0:
            return self.simulation_scenes.earliest('time').time
        return None

    def resolve_end_time(self, info):
        if self is not None and len(self.simulation_scenes.all()) > 0:
            return self.simulation_scenes.latest('time').time
        return None


class SimulationSceneTypeObject(DjangoObjectType):
    class Meta:
        model = SimulationScene
        exclude_fields = ('simulation',)


class SimulationSceneEventTypeObject(DjangoObjectType):
    class Meta:
        model = SimulationSceneEvent
        exclude_fields = ('simulation_scene',)


class Query(graphene.ObjectType):
    simulations = graphene.List(SimulationTypeObject,
                                simulation_id=graphene.Int(),
                                name=graphene.String(),
                                desc=graphene.String(),
                                scene_id=graphene.Int(),
                                scenario_id=graphene.Int())
    simulation_scenes = graphene.List(SimulationSceneTypeObject,
                                      scene_id=graphene.Int(),
                                      time=graphene.DateTime())
    simulation_scene_events = \
        graphene.List(SimulationSceneEventTypeObject,
                      event_id=graphene.Int(),
                      road_segment_id=graphene.Int(),
                      road_condition_type_id=graphene.Int())

    def resolve_simulations(self, info, simulation_id=None, name=None,
                            desc=None,
                            scene_id=None, scenario_id=None, **kwargs):
        """
        Queries simulations from the database
        :param info:
        :param simulation_id: The simulation ID to filter on
        :param name: The (part of the) name to filter on
        :param desc: The (part of the) description to filter on
        :param scene_id: The scene ID to filter on
        :param kwargs:
        :return: All (filtered) simulations
        """
        has_perms(info, ['simulations.view_simulation'])
        res = Simulation.objects.all()
        if scenario_id:
            rs = RoadSegment.objects.filter(
                scenario__id__exact=scenario_id)
            res = res.filter(Q(
                simulation_scenes__simulation_scene_events__road_segment__in=rs
            )).distinct()
        if simulation_id:
            res = res.filter(Q(id__exact=simulation_id))
        if name:
            res = res.filter(Q(name__icontains=name))
        if desc:
            res = res.filter(Q(description__icontains=desc))
        if scene_id:
            res = res.filter(Q(simulation_scenes__id__exact=scene_id))
        return res

    def resolve_simulation_scenes(self, info, scene_id=None, time=None,
                                  **kwargs):
        """
        NOTE: Not sure if this query is needed
        Queries simulation_scenes from the database
        :param info:
        :param scene_id: The scene ID to filter on
        :param time: The time to filter on
        :param kwargs:
        :return: All (filtered) simulation_scenes
        """
        has_perms(info, ['simulations.view_simulationscene'])
        res = SimulationScene.objects.all()
        if scene_id:
            res = res.filter(Q(id__exact=scene_id))
        if time:
            res = res.filter(Q(time__exact=time))
        return res

    def resolve_simulation_scene_events(self, info, event_id=None,
                                        road_segment_id=None,
                                        road_condition_type_id=None, **kwargs):
        """
        NOTE: Not sure if this query is needed
        :param info:
        :param event_id: The event ID to filter on
        :param road_segment_id: The road_segment ID to filter on
        :param road_condition_type_id: The road_condition_type ID to filter on
        :param kwargs:
        :return: All (filtered) simulation_scene_events
        """
        has_perms(info, ['simulations.view_simulationsceneevent'])
        res = SimulationSceneEvent.objects.all()
        if event_id:
            res = res.filter(Q(id__exact=event_id))
        if road_segment_id:
            res = res.filter(Q(road_segment__id__exact=road_segment_id))
        if road_condition_type_id:
            res = res.filter(
                Q(road_condition_type__id__exact=road_condition_type_id))

        return res


class CreateSimulation(graphene.Mutation):
    """
    Creates a new simulation containing a list of simulation scenes,
     that contains a list of scene events
    """
    id = graphene.Int()
    name = graphene.String()
    description = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        simulation_scenes = graphene.List(SimulationSceneInputObject,
                                          required=True)

    def mutate(self, info, name, simulation_scenes, description=""):
        has_perms(info, ['simulations.add_simulation'])
        try:
            simulation = create_simulation(name, description,
                                           simulation_scenes)
            return CreateSimulation(
                id=simulation.id,
                name=simulation.name,
                description=simulation.description
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class CreateSimulationScene(graphene.Mutation):
    """
    Creates a new simulation scene (containing a list of scene events)
    """
    id = graphene.Int()
    simulation_id = graphene.Int()
    time = graphene.DateTime()

    class Arguments:
        simulation_id = graphene.Int(required=True)
        time = graphene.DateTime(required=True)
        scene_events = graphene.List(SimulationSceneEventInputObject)

    def mutate(self, info, simulation_id, time, scene_events=None):
        has_perms(info, ['simulations.add_simulationscene'])
        try:
            simulation_scene = create_simulation_scene(simulation_id, time,
                                                       scene_events)
            return CreateSimulationScene(
                id=simulation_scene.id,
                simulation_id=simulation_scene.simulation.id,
                time=simulation_scene.time
            )

        except ApiException as exc:
            raise GraphQLError(str(exc))


class CreateSimulationSceneEvent(graphene.Mutation):
    """
    Creates a new scene event
    """
    id = graphene.Int()
    simulation_scene_id = graphene.Int()
    road_segment_id = graphene.Int()
    road_condition_type_id = graphene.Int()
    value = graphene.Int()

    class Arguments:
        simulation_scene_id = graphene.Int(required=True)
        road_segment_id = graphene.Int(required=True)
        road_condition_type_id = graphene.Int(required=True)
        value = graphene.Int(required=True)

    def mutate(self, info, simulation_scene_id, road_segment_id,
               road_condition_type_id, value):
        has_perms(info, ['simulations.add_simulationsceneevent'])
        try:
            simulation_scene_event = create_simulation_scene_event(
                simulation_scene_id, road_segment_id,
                road_condition_type_id, value)

            rct = simulation_scene_event.road_condition_type.id
            return CreateSimulationSceneEvent(
                id=simulation_scene_event.id,
                simulation_scene_id=simulation_scene_event.simulation_scene.id,
                road_segment_id=simulation_scene_event.road_segment.id,
                road_condition_type_id=rct,
                value=simulation_scene_event.value
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateSimulation(graphene.Mutation):
    """
    Updates a simulation and its parameters
    """
    id = graphene.Int()
    name = graphene.String()
    description = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()

    def mutate(self, info, id, name=None, description=None):
        has_perms(info, ['simulations.change_simulation'])
        try:
            simulation = update_simulation(id, name, description)

            return UpdateSimulation(
                id=simulation.id,
                name=simulation.name,
                description=simulation.description
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateSimulationScene(graphene.Mutation):
    """
    Updates the time of a SimulationScene
    """
    id = graphene.Int()
    simulation_id = graphene.Int()
    time = graphene.DateTime()

    class Arguments:
        id = graphene.Int(required=True)
        time = graphene.DateTime()

    def mutate(self, info, id, time=None):
        has_perms(info, ['simulations.change_simulationscene'])
        try:
            simulation_scene = update_simulation_scene(id, time)

            return UpdateSimulationScene(
                id=simulation_scene.id,
                simulation_id=simulation_scene.simulation.id,
                time=simulation_scene.time
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class UpdateSimulationSceneEvent(graphene.Mutation):
    """
    Updates the parameter of a SimulationSceneEvent
    """
    id = graphene.Int()
    simulation_scene_id = graphene.Int()
    road_segment_id = graphene.Int()
    road_condition_type_id = graphene.Int()
    value = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)
        road_segment_id = graphene.Int()
        road_condition_type_id = graphene.Int()
        value = graphene.Int()

    def mutate(self, info, id, road_segment_id=None,
               road_condition_type_id=None, value=None):
        has_perms(info, ['simulations.change_simulationsceneevent'])
        try:
            event = \
                update_simulation_scene_event(id,
                                              road_segment_id,
                                              road_condition_type_id,
                                              value)
            return UpdateSimulationSceneEvent(
                id=event.id,
                road_segment_id=event.road_segment.id,
                road_condition_type_id=event.road_condition_type.id,
                value=event.value
            )
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteSimulation(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id, **kwargs):
        """
        Deletes the simulation, only if it has no simulation_scenes
        :param info:
        :param id: The ID of the simulation
        :param kwargs:
        :return:
        """
        has_perms(info, ['simulations.delete_simulation'])
        try:
            delete_simulation(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteSimulationScene(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id, **kwargs):
        """
        Deletes the simulation_scene, only if it has no simulation_scene_events
        :param info:
        :param id: The ID of the simulation_scene
        :param kwargs:
        :return:
        """
        has_perms(info, ['simulations.delete_simulationscene'])
        try:
            delete_simulation_scene(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class DeleteSimulationSceneEvent(graphene.Mutation):
    id = graphene.Int()

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(self, info, id, **kwargs):
        """
        Deletes the simulation_scene_event
        :param info:
        :param id: The ID of the simulation_scene_event
        :param kwargs:
        :return:
        """
        has_perms(info, ['simulations.delete_simulationsceneevent'])
        try:
            delete_simulation_scene_event(id)
        except ApiException as exc:
            raise GraphQLError(str(exc))


class Mutation(graphene.ObjectType):
    create_simulation = CreateSimulation.Field()
    create_simulation_scene = CreateSimulationScene.Field()
    create_simulation_event = CreateSimulationSceneEvent.Field()
    update_simulation = UpdateSimulation.Field()
    update_simulation_scene = UpdateSimulationScene.Field()
    update_simulation_event = UpdateSimulationSceneEvent.Field()
    delete_simulation = DeleteSimulation.Field()
    delete_simulation_scene = DeleteSimulationScene.Field()
    delete_simulation_event = DeleteSimulationSceneEvent.Field()
