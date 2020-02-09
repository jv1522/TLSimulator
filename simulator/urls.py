from django.urls import path
from .views import SimulatorHomePageView
from .views import start_simulation
from .views import stop_simulation

urlpatterns = [
    path('simulatorHome', SimulatorHomePageView.as_view(), name='simulatorHome'),
    path('simulatorHome/startSimulation', start_simulation, name='startSimulation'),
    path('simulatorHome/stopSimulation', stop_simulation, name='stopSimulation')
]