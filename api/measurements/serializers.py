from rest_framework import serializers
from .models import Measurement


class MeasurementSerializer(serializers.ModelSerializer):
    """
    Serializes Measurement model for API responses.

    Used by:
        - measurements_list endpoint
        - latest_measurement endpoint
    """
    class Meta:
        model = Measurement
        fields = "__all__"