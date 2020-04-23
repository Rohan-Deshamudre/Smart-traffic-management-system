from api.instruments.methods.getter import get_instrument_type_with_name
from api.instruments.models import Instrument

name_key = 'name'
naam_key = 'naam'

type_key = 'type'

latitude_key = 'latitude'
breedtegraad_key = 'breedtegraad'

longitude_key = 'longitude'
lengtegraad_key = 'lengtegraad'

description_key = 'description'
omschrijving_key = 'omschrijving'


def export_instruments(ids, writer):
    cleaned_ids = [x for x in ids if type(x) is int]
    instruments = Instrument.objects.filter(id__in=cleaned_ids)
    writer.writerow(
        [name_key, type_key, latitude_key, longitude_key, description_key])

    for instrument in instruments:
        writer.writerow(
            [instrument.name, instrument.instrument_type.name, instrument.lat,
             instrument.lng,
             instrument.description])


def import_instruments(r):
    stored = 0
    msg = 'success'
    for row in r:
        try:
            name = row[name_key] if name_key in row else row[naam_key]
            instrument_type = get_instrument_type_with_name(row[type_key])
            lat = row[latitude_key] if latitude_key in row else row[
                breedtegraad_key]
            lng = row[longitude_key] if longitude_key in row else row[
                lengtegraad_key]
            description = row[description_key] if description_key in row else \
                row[omschrijving_key]

            if name and lat and lng and description:
                try:
                    Instrument(name=name, instrument_type=instrument_type,
                               lat=lat, lng=lng,
                               description=description).save()
                    stored += 1
                except Exception as exc:
                    print(str(exc))
                    msg = "Not every instrument is stored some names " \
                          "are already found in the database."
        except Exception as exc:
            print(str(exc))
            msg = "CSV format is incorrect. [%s(String);%s(String);%s(Float)" \
                  ";%s(Float);%s(String)]" % (
                      name_key, type_key, latitude_key, longitude_key,
                      description_key)
    return {'stored': stored, 'msg': msg}
