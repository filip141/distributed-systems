import asyncio


class BatchWorker:

    def __init__(self, queue, repository, batch_size):
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