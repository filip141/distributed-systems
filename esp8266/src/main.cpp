#include <Arduino.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <sys/time.h>

#include "secrets.h"

WiFiClient espClient;
PubSubClient mqttClient(espClient);

String deviceId;
String topicTemperature;
String topicPressure;

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

void connectWiFi() {
  Serial.print("Laczenie z Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(false);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int timeout = 0;

  while (WiFi.status() != WL_CONNECTED && timeout < 30) {
    delay(500);
    Serial.print(".");
    timeout++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Polaczono z Wi-Fi");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("MAC: ");
    Serial.println(WiFi.macAddress());
  } else {
    Serial.println("BLAD: brak polaczenia z Wi-Fi!");
  }
}

void connectMQTT() {
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);
  while (!mqttClient.connected()) {
    Serial.print("Laczenie z MQTT...");
    if (mqttClient.connect(deviceId.c_str())) {
      Serial.println("OK");
    } 
    else {
      Serial.print("blad, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" - ponowna proba za 2 s");
      delay(2000);
    }
  }
}

long long getTimestampMs() {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  return ((long long)tv.tv_sec * 1000LL) + (tv.tv_usec / 1000);
}

void publishMeasurement() {
  JsonDocument doc;

  doc["device_id"] = deviceId;
  doc["sensor"] = "temperature";
  doc["value"] = 24.5;
  doc["unit"] = "C";
  doc["ts_ms"] = getTimestampMs();;

  char payload[256];

  serializeJson(doc, payload);
  mqttClient.publish(topicTemperature.c_str(), payload);

  Serial.print("Publikacja na topic: ");
  Serial.println(topicTemperature);
  Serial.println(payload);
}

void publishPressure() {
  JsonDocument doc;

  doc["device_id"] = deviceId;
  doc["sensor"] = "preassure";
  doc["value"] = sin(100 * 2.0 * M_PI * getTimestampMs() * 0.001);
  doc["unit"] = "Pa";
  doc["ts_ms"] = getTimestampMs();

  char payload[256];

  serializeJson(doc, payload);
  mqttClient.publish(topicPressure.c_str(), payload);

  Serial.print("Publikacja na topic: ");
  Serial.println(topicPressure);
  Serial.println(payload);
}

void setup() {
  Serial.begin(115200);

  delay(1000);

  deviceId = generateDeviceIdFromEfuse();
  topicTemperature = "lab/" + String(MQTT_GROUP) + "/" + deviceId + "/temperature";
  topicPressure = "lab/" + String(MQTT_GROUP) + "/" + deviceId + "/pressure";

  Serial.print("Device ID: ");
  Serial.println(deviceId);

  connectWiFi();
  connectMQTT();
  
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  struct tm timeinfo;

  while (!getLocalTime(&timeinfo)) {
    Serial.println("Oczekiwanie na synchronizacje czasu...");
    delay(500);
  }
  Serial.println("Czas zsynchronizowany.");
}

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