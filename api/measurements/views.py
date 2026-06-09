from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Measurement
from .serializers import MeasurementSerializer
from .selectors import (
    get_latest_measurement,
    get_measurements_history,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """
    Health check endpoint.

    Used to verify if API service is running.

    Returns:
        Response: JSON object with service status.

    Example response:
        {
            "status": "ok"
        }
    """
    return Response({"status": "ok"})


@api_view(["GET"])
def measurements_list(request):
    """
    Returns a list of latest measurements.

    Query Params:
        limit (int): Number of latest measurements to return.
            Default: 20

    Returns:
        Response: List of serialized Measurement objects.

    Example response:
        [
            {
                "device_id": "esp8266-xxxx",
                "sensor": "temperature",
                "value": 24.5,
                "unit": "C",
                "ts_ms": 123456789
            }
        ]
    """
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
    """
    Returns the most recent measurement from database.

    Business logic:
        Delegates retrieval to selector layer.

    Returns:
        Response:
            200: Latest Measurement object
            404: If no measurements exist

    Example response:
        {
            "device_id": "esp8266-xxxx",
            "sensor": "pressure",
            "value": 1013.2,
            "unit": "Pa",
            "ts_ms": 123456789
        }
    """
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
    """
    Returns historical measurements filtered by device and sensor.

    Query Params:
        device_id (str): ID of ESP device (optional)
        sensor (str): Sensor type (optional)
        limit (int): Max number of results (default: 100)

    Returns:
        Response: List of Measurement objects.

    Example request:
        /api/measurements/history/?device_id=esp8266-123&sensor=temperature&limit=50

    Example response:
        [
            {
                "device_id": "esp8266-xxxx",
                "sensor": "temperature",
                "value": 23.8,
                "unit": "C",
                "ts_ms": 123456789
            }
        ]
    """
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