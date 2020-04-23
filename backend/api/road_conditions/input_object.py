import graphene


class RoadConditionDateInputObject(graphene.InputObjectType):
    start_cron = graphene.String(required=True)
    end_cron = graphene.String(required=True)
    start_date = graphene.Date(required=True)
    end_date = graphene.Date(required=True)
    end_repeat_date = graphene.String(required=True)
