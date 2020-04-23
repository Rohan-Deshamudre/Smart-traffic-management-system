from ndw.database.location.methods import create_location_from_points, \
    location_has_points
from ndw.database.measurement_site.model import MeasurementSite, \
    MeasurementSiteIndex


def create_measurement_site(name, version, points, indices):
    m = MeasurementSite.objects.filter(name=name).filter(
        version=version).first()
    if not m:
        location = create_location_from_points(points)
        measurement_site = MeasurementSite(name=name, version=version,
                                           location=location)
        measurement_site.save()
        for index in indices:
            MeasurementSiteIndex(measurement_site=measurement_site,
                                 index=index).save()
    else:
        if not m.location or not location_has_points(m.location, points):
            location = create_location_from_points(points)
            m.location = location
            m.save()

        site_indices = m.indices.all()

        for measurement_site_index in site_indices:
            if measurement_site_index.index not in indices:
                measurement_site_index.delete()
            else:
                indices.remove(measurement_site_index.index)

        for index in indices:
            MeasurementSiteIndex(measurement_site=m, index=index).save()


def get_indices(measurement_site: MeasurementSite):
    indices = {}
    if measurement_site:
        for i in measurement_site.indices.all():
            indices[i.index] = i

    return indices


def get_location(measurement_site: MeasurementSite):
    loc = []
    if measurement_site and measurement_site.location:
        for point in measurement_site.location.points.all():
            loc.append([float(point.lng), float(point.lat)])

        if len(loc) == 1:
            return loc[0]

    return loc
