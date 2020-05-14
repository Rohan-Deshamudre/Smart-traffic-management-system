import csv
import json

from django.http import HttpResponseNotAllowed, JsonResponse, HttpResponse

from api.instruments.compression import export_instruments
from api.scenarios.compression import to_json_scenario_by_id
from api.response_plans.compression import to_json_response_plan_by_id


def handle_scenario(request):
    response = {}
    scenario_id = request.GET.get('id')
    if scenario_id:
        response = to_json_scenario_by_id(scenario_id)

    return JsonResponse(response)


def handle_instrument(request):
    if request.method == 'POST':

        response = HttpResponse(content_type='text/csv')
        response[
            'Content-Disposition'] = 'attachment; filename="somefilename.csv"'
        export_instruments(json.loads(request.body.decode('utf-8')),
                           csv.writer(response, delimiter=';'))

        return response
    else:
        return HttpResponseNotAllowed(permitted_methods='POST')


def handle_response_plan(request):
    if request.method == 'POST':
        response = {}
        body = json.loads(request.body.decode('utf-8'))
        if body['id']:
            response = to_json_response_plan_by_id(body['id'])
        return JsonResponse(response)
    else:
        return HttpResponseNotAllowed(permitted_methods='POST')
