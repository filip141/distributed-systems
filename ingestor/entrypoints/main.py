"""
Entry point of the MQTT ingestion service.

This service is responsible for consuming MQTT messages,
buffering them in an asynchronous queue, and persisting
them into a PostgreSQL database using batch processing.

Architecture follows a producer-consumer pattern:

    MQTTConsumer (producer)
        ↓
    asyncio.Queue (buffer)
        ↓
    BatchWorker (consumer)
        ↓
    PostgreSQL (storage)

The system is fully asynchronous and designed for
non-blocking message processing under load.
"""

import asyncio
import asyncpg

from services.worker import BatchWorker
from infrastructure.db import MeasurementDatabase
from infrastructure.mqtt_consumer import MQTTConsumer
from infrastructure.settings import settings


async def main():
    """
    Initialize and run the MQTT ingestion pipeline.

    This function sets up all required system components:
    - asyncio queue for communication between tasks
    - PostgreSQL connection pool (asyncpg)
    - MQTT consumer (message ingestion layer)
    - batch worker (database persistence layer)

    Execution model:
    Two async tasks are executed concurrently using asyncio.gather():
    - MQTTConsumer: listens for incoming MQTT messages
    - BatchWorker: processes and stores messages in batches

    This ensures:
    - non-blocking IO
    - decoupled ingestion and persistence
    - resilience under high message throughput

    Returns:
        None
    """

    queue = asyncio.Queue()

    pool = await asyncpg.create_pool(
        host=settings.db_host,
        database=settings.db_name,
        user=settings.db_user,
        password=settings.db_password
    )
    database = MeasurementDatabase(
        pool=pool
    )

    consumer = MQTTConsumer(
        settings=settings,
        queue=queue,
    )

    worker = BatchWorker(
        queue=queue,
        repository=database,
        batch_size=settings.batch_size
    )

    await asyncio.gather(
        worker.run(),
        consumer.run()
    )
    print("Database connection pool created successfully.")


if __name__ == "__main__":
    asyncio.run(main())