 # System Architecture

 ## 1. Overview

 The system is an IoT data pipeline designed to collect, transmit, process, and visualize sensor data from ESP8266 devices.

 Data flows from embedded devices through a secure MQTT broker to backend services, where it is stored and exposed via a REST API and visualized in a web interface.

 Communication between components is containerized using Docker Compose.

 ---

 ## 2. High-Level Architecture

 ```
 ESP8266 devices
       ↓ (MQTT over TLS)
 Mosquitto Broker
       ↓
 Ingestor Service
       ↓
 PostgreSQL Database
       ↓
 Django REST API
       ↓
 React Frontend
 ```

 ---

 ## 3. Components

 ## 3.1 ESP8266 Devices

 The ESP8266 nodes are responsible for:

 - Connecting to Wi-Fi
 - Synchronizing time via NTP (required for TLS validation)
 - Establishing a secure MQTT connection (TLS)
 - Publishing sensor data (temperature, pressure)

 **Protocol:** MQTT over TLS  
 **Security:** Certificate-based authentication (CA verification)

 ---

 ## 3.2 MQTT Broker (Mosquitto)

 The broker acts as the central message hub.

 Responsibilities:

 - Accept TLS-secured MQTT connections on port `8883`
 - Validate client certificates
 - Route messages between publishers and subscribers
 - Support retained messages and persistent sessions

 ---

 ## 3.3 Ingestor Service

 Python-based asynchronous service consuming MQTT messages.

 Responsibilities:

 - Subscribe to MQTT topics (`lab/+/+/+`)
 - Parse JSON payloads into internal measurement models
 - Validate and transform incoming data
 - Persist data into PostgreSQL

 **Tech stack:**

 - `aiomqtt`
 - `asyncio`
 - `pydantic`

 ---

 ## 3.4 PostgreSQL Database

 Persistent storage layer for all measurements.

 Stores:

 - device_id
 - sensor type
 - measurement value
 - timestamp
 - topic metadata

 Used for historical analysis and API queries.

 ---

 ## 3.5 Django API

 REST API layer exposing stored data.

 Responsibilities:

 - Provide endpoints for measurements
 - Filter data by device, sensor, time range
 - Serialize database models into JSON

 ---

 ## 3.6 React Frontend

 Web application for visualizing sensor data.

 Responsibilities:

 - Display real-time and historical measurements
 - Fetch data from Django REST API
 - Provide user-friendly dashboards

 ---

 ## 4. Data Flow

 1. ESP8266 collects sensor data
 2. Data is published via MQTT over TLS
 3. Mosquitto broker receives and routes messages
 4. Ingestor consumes MQTT messages asynchronously
 5. Data is stored in PostgreSQL
 6. Django API exposes data via REST endpoints
 7. React frontend visualizes data

 ---

 ## 5. Docker Deployment

 System is orchestrated using Docker Compose:

 Services:

 - `broker` → MQTT Mosquitto broker
 - `ingestor` → MQTT consumer + DB writer
 - `database` → PostgreSQL
 - `django` → REST API backend
 - `ui` → React frontend

 ---

 ## 6. Security Considerations

 - MQTT communication secured using TLS (port 8883)
 - Certificate authority used to validate broker identity
 - ESP8266 validates broker certificate using CA chain
 - Time synchronization via NTP required for TLS validation

 ---

 ## 7. Notes

 - System assumes stable DNS/IP mapping for broker
 - TLS requires correct certificate configuration on both ESP8266 and broker
 - Ingestor depends on broker availability

 ---