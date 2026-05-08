from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Measurement
from .serializers import MeasurementSerializer
from .selectors import (
    get_latest_measurement,
    get_measurements_history,
)


@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
def measurements_list(request):
    limit = int(request.GET.get("limit", 20))

    measurements = (
        Measurement.objects
        .order_by("-ts_ms")[:limit]
    )

    serializer = MeasurementSerializer(
        measurements,
        many=True,
    )
    return Response(serializer.data)


@api_view(["GET"])
def latest_measurement(request):

    measurement = get_latest_measurement()
    if not measurement:
        return Response(
            {"detail": "No measurements"},
            status=404,
        )

    serializer = MeasurementSerializer(measurement)
    return Response(serializer.data)


@api_view(["GET"])
def measurement_history(request):

    device_id = request.GET.get("device_id")
    sensor = request.GET.get("sensor")
    limit = int(request.GET.get("limit", 100))

    measurements = get_measurements_history(
        device_id=device_id,
        sensor=sensor,
        limit=limit,
    )
    serializer = MeasurementSerializer(
        measurements,
        many=True,
    )
    return Response(serializer.data)