"""
This router ensures queries are redirected to the scenarios database.
"""


class DBRouter(object):
    route_app_labels = {'instruments', 'instrument_actions', 'scenarios',
                        'road_segments', 'road_conditions', 'routes',
                        'simulations', 'folders', 'labels'}

    ndw_app_labels = {'measurement_site', 'location'}

    def db_for_read(self, model, **hints):
        """
        Reads go to a randomly-chosen replica.
        """
        from django.conf import settings
        if 'scenarios' not in settings.DATABASES:
            return None
        if model._meta.app_label in self.route_app_labels:
            return 'scenarios'
        if model._meta.app_label in self.ndw_app_labels:
            return 'ndw'
        return None

    def db_for_write(self, model, **hints):
        """
        Writes always go to primary.
        """
        from django.conf import settings
        if 'scenarios' not in settings.DATABASES:
            return None
        if model._meta.app_label in self.route_app_labels:
            return 'scenarios'
        if model._meta.app_label in self.ndw_app_labels:
            return 'ndw'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        """
        Relations between objects are allowed if both objects are
        in the primary/replica pool.
        """
        db_list = ('primary', 'replica1', 'replica2')
        if obj1._state.db in db_list and obj2._state.db in db_list:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        All non-auth models end up in this pool.
        """
        return True
