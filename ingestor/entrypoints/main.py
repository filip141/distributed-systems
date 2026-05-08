import asyncio
import asyncpg

from services.worker import BatchWorker
from infrastructure.db import MeasurementDatabase
from infrastructure.mqtt_consumer import MQTTConsumer
from infrastructure.settings import settings


async def main():

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