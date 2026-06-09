"""
MQTT consumer module responsible for receiving sensor data
from broker and forwarding it to processing pipeline.
"""

import os
import ssl
import json
import asyncio

from aiomqtt import Client
from domain.models import Measurement
from infrastructure.settings import Settings

BASE_DIR = os.path.dirname(os.path.dirname(__file__)) 
CA_PATH = os.path.join(BASE_DIR, "certs", "ca.crt")
ssl_context = ssl.create_default_context()
ssl_context.load_verify_locations(cafile=CA_PATH)
ssl_context.check_hostname = False

class MQTTConsumer:
    """
    Asynchronous MQTT consumer.

    Responsibilities:
    - connect to MQTT broker over TLS
    - subscribe to measurement topics
    - parse JSON payloads
    - push validated measurements into async queue
    """

    def __init__(self, settings: Settings, queue: asyncio.Queue[Measurement]):
        """
        Args:
            settings: application configuration
            queue: asyncio.Queue for inter-task communication
        """
        self.settings = settings
        self.queue = queue

    def parse_message(self, topic: str, payload: bytes) -> Measurement:
        """
        Convert MQTT message payload into Measurement model.

        Args:
            topic (str): MQTT topic name
            payload (bytes): raw MQTT payload

        Returns:
            Measurement: validated domain object
        """
        raw_data = json.loads(payload.decode())

        return Measurement(
            **raw_data,
            topic=topic
        )
        

    async def run(self):
        """
        Start MQTT consumer loop.

        Subscribes to configured topics and continuously
        processes incoming messages.
        """
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

        