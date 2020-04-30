from ndw.datex_ii.meta import XML_DATEX, XML_XMI


class Locations:
    @staticmethod
    def handle_point(point):
        coord = point.find('{%s}locationForDisplay' % XML_DATEX)
        if coord is None:
            coord = point.find(
                '{%s}pointByCoordinates/{%s}pointCoordinates' % (
                    XML_DATEX, XML_DATEX))
        if coord is None:
            return
        lat = float(coord.find('{%s}latitude' % XML_DATEX).text)
        lng = float(coord.find('{%s}longitude' % XML_DATEX).text)
        return [lng, lat]

    @staticmethod
    def handle_linear(linear):

        coord = linear.find(
            '{%s}linearExtension/{%s}linearByCoordinatesExtension' % (
                XML_DATEX, XML_DATEX))
        if coord is None:
            coord = linear.find('{%s}locationForDisplay' % XML_DATEX)
            lat = float(coord.find('{%s}latitude' % XML_DATEX).text)
            lng = float(coord.find('{%s}longitude' % XML_DATEX).text)
            return [lng, lat]
        start = coord.find(
            '{%s}linearCoordinatesStartPoint/{%s}pointCoordinates' % (
                XML_DATEX, XML_DATEX))
        end = coord.find(
            '{%s}linearCoordinatesEndPoint/{%s}pointCoordinates' % (
                XML_DATEX, XML_DATEX))

        s_lat = float(start.find('{%s}latitude' % XML_DATEX).text)
        s_lng = float(start.find('{%s}longitude' % XML_DATEX).text)
        e_lat = float(end.find('{%s}latitude' % XML_DATEX).text)
        e_lng = float(end.find('{%s}longitude' % XML_DATEX).text)

        if s_lat == e_lat and s_lng == e_lng:
            return [s_lng, s_lat]
        return [[s_lng, s_lat], [e_lng, e_lat]]

    @staticmethod
    def handle_area(area):
        pass

    @staticmethod
    def handle_non_ordered(non_ordered):
        coordinates = non_ordered.findall(
            '{%s}locationContainedInGroup' % XML_DATEX)

        all_coordinates = []
        for i in coordinates:
            all_coordinates.append(Locations.handle_point(i))

        return all_coordinates if len(all_coordinates) > 1 else \
            all_coordinates[0]

    @staticmethod
    def handle_itinerary(itinerary):

        coordinate = \
            itinerary.findall('{%s}locationContainedInItinerary' % XML_DATEX)[
                0]
        return Locations.handle_location(
            coordinate.find('{%s}location' % XML_DATEX))

    @staticmethod
    def handle_location(location):
        loc_type = location.get('{%s}type' % XML_XMI)
        if loc_type == 'Point':
            return Locations.handle_point(location)
        elif loc_type == 'Linear':
            return Locations.handle_linear(location)
        elif loc_type == 'Area':
            return Locations.handle_area(location)
        elif loc_type == 'NonOrderedLocationGroupByList':
            return Locations.handle_non_ordered(location)
        elif loc_type == 'ItineraryByIndexedLocations':
            return Locations.handle_itinerary(location)

    @staticmethod
    def handle_group_of_location(situation):
        group_of_locations = situation.find('{%s}groupOfLocations' % XML_DATEX)
        return Locations.handle_location(group_of_locations)
