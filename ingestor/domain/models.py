from pydantic import BaseModel, Field, field_validator, computed_field

from typing import Optional


class Measurement(BaseModel):
    device_id: str = Field(min_length=1)
    sensor: str = Field(min_length=1)

    value: float

    ts_ms: int = Field(gt=0)

    group_id: Optional[str] = None
    unit: Optional[str] = None
    seq: Optional[int] = None

    topic: Optional[str] = None

    @field_validator("sensor")
    @classmethod
    def normalize_sensor(cls, v: str):
        return v.strip().lower()

    @computed_field
    @property
    def measurement_key(self) -> str:
        return f"{self.device_id}:{self.sensor}"


class IngestResult(BaseModel):

    accepted: bool
    measurement_key: str
    error: Optional[str] = None


class BatchResult(BaseModel):

    total: int
    saved: int
    failed: int

    results: list[IngestResult]
