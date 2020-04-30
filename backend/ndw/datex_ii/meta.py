XML_SOAP = 'http://schemas.xmlsoap.org/soap/envelope/'
XML_DATEX = 'http://datex2.eu/schema/2/2_0'
XML_XMI = 'http://www.w3.org/2001/XMLSchema-instance'

SITUATION_RECORD_PINPOINT = \
    '{%s}Body/{%s}d2LogicalModel/{%s}payloadPublication/' \
    '{%s}situation/{%s}situationRecord' % (
        XML_SOAP, XML_DATEX, XML_DATEX, XML_DATEX, XML_DATEX)
MEASUREMENT_TABLE_PINPOINT = '{%s}Body/{%s}d2LogicalModel/{%s}' \
                             'payloadPublication/{%s}measurementSiteTable' \
                             '/{%s}measurementSiteRecord' % (
                                 XML_SOAP, XML_DATEX, XML_DATEX, XML_DATEX,
                                 XML_DATEX)
MEASUREMENT_PINPOINT = '{%s}Body/{%s}d2LogicalModel/{%s}' \
                       'payloadPublication/{%s}siteMeasurements' % (
                           XML_SOAP, XML_DATEX, XML_DATEX, XML_DATEX,)

URL = "http://opendata.ndw.nu/%s.xml.gz"
FILE_LOC = 'opendata/%s.%s'


def strip(a):
    print(a)
    print(a.attrib)
    for i in a:
        print(i.tag)

    print()
