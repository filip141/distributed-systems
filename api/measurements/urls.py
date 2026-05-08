from django.urls import path

from .views import (
    health,
    measurements_list,
    latest_measurement,
    measurement_history,
)

urlpatterns = [
    path("health/", health),
    path("measurements/", measurements_list),
    path("measurements/latest/", latest_measurement),
    path("measurements/history/", measurement_history),
]