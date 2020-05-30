import shapefile


SHP_LOC = "shapefiles/Telpunten_WGS84.shp"
DBF_LOC = "shapefiles/Telpunten_WGS84.dbf"
sf = None


def fetch_shapefile():
    global sf
    if sf is None:
        myshp = open(SHP_LOC, "rb")
        mydbf = open(DBF_LOC, "rb")
        sf = shapefile.Reader(shp=myshp, dbf=mydbf)
    print(sf)
    return sf
