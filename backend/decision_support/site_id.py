import shapefile
from api.routes.models import RouteSegment
from utils.route import distance_meters


SHP_LOC = "shapefiles/Telpunten_WGS84.shp"
DBF_LOC = "shapefiles/Telpunten_WGS84.dbf"
sf = None


def fetch_shapefile():
    global sf
    if sf is None:
        myshp = open(SHP_LOC, "rb")
        mydbf = open(DBF_LOC, "rb")
        sf = shapefile.Reader(shp=myshp, dbf=mydbf)
    return sf


def fetch_site_id(segment: RouteSegment) -> RouteSegment:
    global sf
    if sf is None:
        sf = fetch_shapefile()

    closest = None
    index = -1
    if segment.site_id is None:
        for idx, shape in enumerate(sf.shapes()):
            if closest is None:
                closest = shape.points[0]
                index = idx
            else:
                curr = distance_meters(shape.points[0], [segment.lng, segment.lat])
                close = distance_meters(closest, [segment.lng, segment.lat])
                if curr < close:
                    closest = curr
                    index = idx

    if closest is not None:
        segment.lng = closest[0]
        segment.lat = closest[1]
        segment.site_id = sf.record(index)
        segment.save()

    return segment
