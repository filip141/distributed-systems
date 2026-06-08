import os
import ssl
import json

from aiomqtt import Client
from domain.models import Measurement

BASE_DIR = os.path.dirname(os.path.dirname(__file__)) 
CA_PATH = os.path.join(BASE_DIR, "certs", "ca.crt")
ssl_context = ssl.create_default_context()
ssl_context.load_verify_locations(cafile=CA_PATH)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

class MQTTConsumer:

    def __init__(self, settings, queue):
        self.settings = settings
        self.queue = queue

    def parse_message(self, topic: str, payload: bytes) -> Measurement:
        raw_data = json.loads(payload.decode())

        return Measurement(
            **raw_data,
            topic=topic
        )
        

    async def run(self):
        async with Client(hostname=self.settings.mqtt_host, 
                          port=self.settings.mqtt_port,
                          tls_context=ssl_context) as client:
            await client.subscribe(self.settings.mqtt_topic, qos=1)
            async for message in client.messages:
                try:
                    measurement = (
                            self.parse_message(
                                topic=message.topic.value,
                                payload=message.payload
                            )
                    )
                    await self.queue.put(measurement)
                except Exception as e:
                    print(f"Failed to parse message: {e}")

        