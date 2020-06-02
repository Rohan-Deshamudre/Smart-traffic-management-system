from ndw.datex_ii.meta import XML_DATEX, XML_XMI
from ndw.datex_ii.endpoints.message_object import spd_typ, int_typ


class Measurement:
    @staticmethod
    def handle_traffic_speed(data):
        value = data.find("{%s}averageVehicleSpeed/{%s}speed" % (XML_DATEX, XML_DATEX))
        return float(value.text)

    @staticmethod
    def handle_traffic_flow(data):
        value = data.find(
            "{%s}vehicleFlow/{%s}vehicleFlowRate" % (XML_DATEX, XML_DATEX)
        )
        return float(value.text)

    @staticmethod
    def handle_measurement_type(measurement_value):
        basic_data = measurement_value.find(
            "{%s}measuredValue/{%s}basicData" % (XML_DATEX, XML_DATEX)
        )
        measure_type = basic_data.get("{%s}type" % XML_XMI)
        if measure_type == "TrafficSpeed":
            return (spd_typ, Measurement.handle_traffic_speed(basic_data))
        if measure_type == "TrafficFlow":
            return (int_typ, Measurement.handle_traffic_flow(basic_data))
        else:
            return 0
