# Security

## Transport encryption

- MQTT uses TLS (port 8883)
- encrypted communication between ESP8266 and broker

---

## Certificates

- CA certificate stored on ESP8266
- broker uses server certificate signed by CA

---

## Authentication

- client authentication via TLS session
- no anonymous access in production setup recommended

---

## Risks

- self-signed certificates require manual trust setup