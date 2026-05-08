from django.db import models


class Measurement(models.Model):
    group_id = models.CharField(max_length=100, null=True)
    device_id = models.CharField(max_length=100)
    sensor = models.CharField(max_length=100)
    value = models.FloatField()
    unit = models.CharField(max_length=20, null=True)
    ts_ms = models.BigIntegerField()
    seq = models.IntegerField(null=True)
    topic = models.CharField(max_length=255)

    class Meta:
        db_table = "measurements"
        indexes = [
            models.Index(fields=["device_id"]),
            models.Index(fields=["sensor"]),
            models.Index(fields=["ts_ms"]),
        ]

    def __str__(self):
        return f"{self.device_id} {self.sensor}={self.value}"