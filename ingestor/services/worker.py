import asyncio
from domain.models import Measurement
from infrastructure.db import MeasurementDatabase


class BatchWorker:

    def __init__(self, 
                 queue: asyncio.Queue[Measurement], 
                 repository: MeasurementDatabase, 
                 batch_size: int
                 ):
        self.queue = queue
        self.repository = repository
        self.batch_size = batch_size

    async def run(self):
        while True:
            batch = []
            measurement = await self.queue.get()
            print(f"Got measurement from queue: {measurement}")
            batch.append(measurement)
            while len(batch) < self.batch_size:
                try:
                    measurement = self.queue.get_nowait()
                    print(f"Got measurement from queue: {measurement}")
                    batch.append(measurement)
                except asyncio.QueueEmpty:
                    break

            await self.repository.save_batch(batch)
            print(f"Saved batch of {len(batch)} measurements to database.")