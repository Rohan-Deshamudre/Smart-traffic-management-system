import json
import csv
from django.http import HttpResponseNotAllowed, JsonResponse

from api.instruments.compression import import_instruments
from api.scenarios.compression import import_scenario
from api.response_plans.compression import import_response_plan


def handle_scenario(request):
    if request.method == 'POST':
        response = import_scenario(json.loads(request.body.decode('utf-8')))
        return JsonResponse(response)
    else:
        return HttpResponseNotAllowed(permitted_methods='POST')


def handle_instrument(request):
    if request.method == 'POST':
        file = request._body.decode('utf-8')
        response = import_instruments(
            csv.DictReader(file.splitlines(), delimiter=";"))

        return JsonResponse(response)
    else:
        return HttpResponseNotAllowed(permitted_methods='POST')


def handle_response_plan(request):
    if request.method == 'POST':
        response = import_response_plan(
            json.loads(request.body.decode('utf-8')))
        return JsonResponse(response)
    else:
        return HttpResponseNotAllowed(permitted_methods='POST')
