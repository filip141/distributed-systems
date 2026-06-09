 # Data Model

 ## 1. Overview

 The system processes sensor measurements sent by ESP8266 devices via MQTT.
 All incoming data is serialized in JSON format and stored in a PostgreSQL database.

 Each message represents a single sensor measurement event.

 ---

 ## 2. Measurement Schema

 The standard message format published by ESP8266 devices is defined as follows:

 ```
 {
   "device_id": "esp8266-18FE34DAC1EC",
   "sensor": "temperature",
   "value": 24.5,
   "unit": "C",
   "ts_ms": 1717761234567
 }
 ```

 ---

 ## 3. Field Description

 | Field       | Type   | Description |
 |--------------|--------|-------------|
 | device_id    | string | Unique identifier of ESP8266 device (derived from MAC address) |
 | sensor       | string | Sensor type (e.g. temperature, pressure) |
 | value        | float  | Measured value from sensor |
 | unit         | string | Measurement unit (e.g. C, Pa) |
 | ts_ms        | int    | Timestamp in milliseconds since epoch |

 ---

 ## 4. MQTT Payload Mapping

 Incoming MQTT messages are parsed directly into the Measurement model.

 Mapping:

 - MQTT topic → metadata (device grouping, sensor type)
 - JSON payload → Measurement object

 Example topic structure:

 ```
 lab/{group}/{device_id}/{sensor}
 ```

 ---

 ## 5. Internal Representation (Ingestor)

 In the ingestor service, the data is mapped to a Python model:

 ```
 Measurement(
     device_id=str,
     sensor=str,
     value=float,
     unit=str,
     ts_ms=int,
     topic=str
 )
 ```

 ---

 ## 6. Database Representation

 In PostgreSQL, measurements are stored as rows in a single table:

 - id (primary key)
 - device_id
 - sensor
 - value
 - unit
 - ts_ms
 - topic
 - created_at (DB timestamp)

 ---

 ## 7. Notes

 - All timestamps are stored in UTC epoch milliseconds
 - Sensor types are extensible (new sensors can be added without schema changes)
 - System assumes JSON payload validity (basic validation in ingestor)

 ---