"""
Database access layer for storing sensor measurements.

Responsible for persisting batches of measurements
into PostgreSQL using async connection pool (asyncpg).
"""

from domain.models import Measurement


class MeasurementDatabase:
    """
    Repository class responsible for database operations
    related to Measurement entities.
    """

    def __init__(self, pool):
        """
        Initialize database repository.

        Args:
            pool: asyncpg connection pool
        """
        self.pool = pool

    async def save_batch(self, measurements: list[Measurement]):
        """
        Persist a batch of measurements into the database.

        Uses asyncpg executemany for efficient bulk insertion.

        Args:
            measurements (list[Measurement]): list of sensor readings

        Returns:
            None
        """

        if not measurements:
            return

        query = """
            INSERT INTO measurements (
                group_id,
                device_id,
                sensor,
                value,
                unit,
                ts_ms,
                seq,
                topic
            )
            VALUES (
                $1,$2,$3,$4,
                $5,$6,$7,$8
            )
        """

        values = [
            (
                m.group_id,
                m.device_id,
                m.sensor,
                m.value,
                m.unit,
                m.ts_ms,
                m.seq,
                m.topic
            )
            for m in measurements
        ]

        async with self.pool.acquire() as conn:
            await conn.executemany(
                query,
                values
            )