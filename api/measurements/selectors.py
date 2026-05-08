from .models import Measurement


def get_latest_measurement():
    return (
        Measurement.objects
        .order_by("-ts_ms")
        .first()
    )


def get_measurements_history(
    device_id=None,
    sensor=None,
    limit=100,
):
    queryset = Measurement.objects.all()
    if device_id:
        queryset = queryset.filter(device_id=device_id)
    if sensor:
        queryset = queryset.filter(sensor=sensor)
    return queryset.order_by("-ts_ms")[:limit]