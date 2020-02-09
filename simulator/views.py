from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .simulator_utils import get_simulator_group_list

# Create your views here.
light_groups = ['g1', 'g2']


class SimulatorHomePageView(TemplateView):
    template_name = 'simulator/simulator_home.html'


@csrf_exempt
def start_simulation(request):
    start_simulation_response = {}
    if request.method == "POST":
        no_lights = request.POST.get('lightCount', '0')
        start_simulation_response['light_groups'] = get_simulator_group_list(no_lights)
    if start_simulation_response:
        return JsonResponse(start_simulation_response)


@csrf_exempt
def stop_simulation(request):
    stop_simulation_response = {}
    stop_simulation_response['message'] = 'Exiting from the traffic lights simulator'
    return JsonResponse(stop_simulation_response)
