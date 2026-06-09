#include <sys/time.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClientSecureBearSSL.h>

#include "secrets.h"
#include "certificate.h"

BearSSL::WiFiClientSecure espClient;
BearSSL::X509List caCert(ca_cert);
PubSubClient mqttClient(espClient);

String deviceId;
String topicTemperature;
String topicPressure;

/**
 * @brief Generates unique device ID based on ESP8266 MAC address.
 *
 * Device ID has format:
 * esp8266-XXYYZZAABBCC
 *
 * Used as MQTT client ID and topic namespace.
 *
 * @return String unique device identifier
 */
String generateDeviceIdFromEfuse() {
  uint8_t mac[6];
  WiFi.macAddress(mac);

  char id[32];
  snprintf(id, sizeof(id),
           "esp8266-%02X%02X%02X%02X%02X%02X",
           mac[0], mac[1], mac[2],
           mac[3], mac[4], mac[5]);

  return String(id);
}

/**
 * @brief Connects ESP8266 to WiFi network.
 *
 * Configures station mode, disables sleep for stability,
 * and attempts connection using credentials from secrets.h.
 *
 * Blocks until connected or timeout is reached.
 */
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(false);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("WiFi connecting");
  int timeout = 0;

  while (WiFi.status() != WL_CONNECTED && timeout < 30) {
    delay(500);
    Serial.print(".");
    timeout++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi OK");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi FAIL");
  }
}

/**
 * @brief Establishes MQTT connection to broker using TLS.
 *
 * Uses deviceId as MQTT client identifier.
 * Reconnects automatically if connection fails.
 *
 * Requires active WiFi connection.
 */
void connectMQTT() {
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  mqttClient.setBufferSize(512);
  mqttClient.setKeepAlive(60);
  mqttClient.setSocketTimeout(10);

  while (!mqttClient.connected()) {
    Serial.print("MQTT connecting...");

    if (mqttClient.connect(deviceId.c_str())) {
      Serial.println("OK");
    } else {
      Serial.print("FAIL rc=");
      Serial.println(mqttClient.state());

      delay(2000);
    }
  }
}

/**
 * @brief Returns current timestamp in milliseconds.
 *
 * Uses system time synchronized via NTP.
 *
 * @return Unix timestamp in milliseconds
 */
long long getTimestampMs() {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  return ((long long)tv.tv_sec * 1000LL) + (tv.tv_usec / 1000);
}

/**
 * @brief Publishes temperature measurement to MQTT broker.
 *
 * Payload format (JSON):
 * {
 *   device_id,
 *   sensor: "temperature",
 *   value,
 *   unit,
 *   ts_ms
 * }
 *
 * Topic:
 * lab/{group}/{device_id}/temperature
 */
void publishMeasurement() {
  StaticJsonDocument<256> doc;

  doc["device_id"] = deviceId;
  doc["sensor"] = "temperature";
  doc["value"] = 24.5;
  doc["unit"] = "C";
  doc["ts_ms"] = getTimestampMs();

  char payload[256];
  serializeJson(doc, payload);

  mqttClient.publish(topicTemperature.c_str(), payload);
}

/**
 * @brief Publishes pressure measurement to MQTT broker.
 *
 * Uses sine wave simulation as fake sensor data.
 *
 * Topic:
 * lab/{group}/{device_id}/pressure
 */
void publishPressure() {
  StaticJsonDocument<256> doc;

  doc["device_id"] = deviceId;
  doc["sensor"] = "pressure";
  doc["value"] = sin(getTimestampMs() * 0.001);
  doc["unit"] = "Pa";
  doc["ts_ms"] = getTimestampMs();

  char payload[256];
  serializeJson(doc, payload);

  mqttClient.publish(topicPressure.c_str(), payload);
}

/**
 * @brief Initializes system: WiFi, time sync, TLS setup, MQTT identifiers.
 *
 * Steps:
 * - initializes Serial
 * - generates device ID
 * - builds MQTT topics
 * - connects WiFi
 * - synchronizes time via NTP (required for TLS)
 * - configures TLS trust anchors
 */
void setup() {
  Serial.begin(115200);
  delay(1000);

  deviceId = generateDeviceIdFromEfuse();

  topicTemperature = "lab/" + String(MQTT_GROUP) + "/" + deviceId + "/temperature";
  topicPressure = "lab/" + String(MQTT_GROUP) + "/" + deviceId + "/pressure";

  Serial.println(deviceId);

  connectWiFi();
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) {
    Serial.println("Waiting NTP...");
    delay(500);
  }

  Serial.println("Time OK");

  // ---------------- TLS SETUP ----------------
  espClient.setTrustAnchors(&caCert);
  espClient.setBufferSizes(512, 512);
  espClient.setTimeout(15000);

  espClient.allowSelfSignedCerts();

  delay(500);
}

/**
 * @brief Main loop handling connectivity and periodic publishing.
 *
 * Responsibilities:
 * - maintain WiFi connection
 * - maintain MQTT connection
 * - process MQTT client loop
 * - publish sensor data every 5 seconds
 */
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (!mqttClient.connected()) {
    connectMQTT();
  }

  mqttClient.loop();

  publishMeasurement();
  publishPressure();

  delay(5000);
}