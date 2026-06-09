# MQTT Topics

System uses hierarchical MQTT topic structure:

## Base structure

lab/{group}/{device_id}/{sensor_type}

---

## Example topics

### Temperature
lab/esp8266_group/esp8266-18FE34DAC1EC/temperature

### Pressure
lab/esp8266_group/esp8266-18FE34DAC1EC/pressure

---

## Payload format

All messages are JSON encoded.

### Example payload

{
  "device_id": "esp8266-18FE34DAC1EC",
  "sensor": "temperature",
  "value": 24.5,
  "unit": "C",
  "ts_ms": 1710000000000
}

---

## QoS

- QoS: 1 (at least once delivery)
- Retained messages: false

---

## Notes

- device_id is derived from ESP8266 MAC address
- timestamps are Unix epoch in milliseconds
- sensors:
  - temperature
  - pressure