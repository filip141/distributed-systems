# System Sequence

## 1. Device startup

ESP8266:
- connects to WiFi
- syncs time via NTP
- establishes TLS connection to MQTT broker

---

## 2. Data publishing

Every 5 seconds:
- temperature is published
- pressure is published

---

## 3. MQTT broker

- receives encrypted TLS traffic
- validates client certificate
- routes messages to subscribers

---

## 4. Ingestor

- subscribes to MQTT topics
- parses JSON payload
- pushes messages into async queue

---

## 5. Batch worker

- collects messages in batches
- writes batch to PostgreSQL

---

## 6. API layer

- exposes REST endpoints
- retrieves latest / historical measurements

---

## 7. UI (React)

- fetches API data
- displays live sensor values