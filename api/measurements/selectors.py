from .models import Measurement


def get_latest_measurement():
    """
    Retrieves the most recent measurement from the database.

    Ordering:
        Results are ordered by timestamp (ts_ms) descending.

    Returns:
        Measurement | None:
            Latest measurement object or None if database is empty.
    """
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
    """
    Retrieves historical measurements with optional filtering.

    Filtering:
        device_id (str, optional): Filter by ESP device ID.
        sensor (str, optional): Filter by sensor type (e.g. temperature, pressure).

    Args:
        device_id (str | None): Device identifier filter.
        sensor (str | None): Sensor type filter.
        limit (int): Maximum number of results to return.

    Returns:
        QuerySet[Measurement]:
            Ordered list of measurements (newest first).

    Example:
        get_measurements_history(device_id="esp8266-abc", sensor="temperature", limit=50)
    """
    queryset = Measurement.objects.all()
    if device_id:
        queryset = queryset.filter(device_id=device_id)
    if sensor:
        queryset = queryset.filter(sensor=sensor)
    return queryset.order_by("-ts_ms")[:limit]