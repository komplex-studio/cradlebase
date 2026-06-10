---
title: "Getting Started with IoT: Build an ESP32 Sensor That Talks to the Cloud via MQTT"
slug: getting-started-with-iot-esp32-mqtt
category: iot
date: 2026-06-01
excerpt: A beginner-friendly introduction to the Internet of Things. Learn the core architecture, why MQTT is the protocol of choice, and how to connect an ESP32 sensor to the cloud.
cover_image:
---

# Getting Started with IoT

The Internet of Things — physical devices that sense the world and send data over the network — sounds complex, but the core ideas are approachable, and you can build a real project with a board that costs a few dollars. This guide explains how IoT systems are actually structured, introduces MQTT (the messaging protocol that powers most IoT), and walks through connecting an ESP32 microcontroller with a sensor to the cloud. Whether you are a student, researcher, or developer branching into hardware, this is the mental model you need.

## What an IoT system actually looks like

People often picture IoT as just "a smart gadget," but every real system has four layers, and understanding them tells you where your code goes.

First is the **device layer**: the physical thing — a microcontroller like an ESP32 or Raspberry Pi — with sensors that measure something (temperature, motion, light) and sometimes actuators that do something (turn on a motor, flash an LED).

Second is the **connectivity layer**: how the device sends data. This might be Wi-Fi, Bluetooth, cellular, or a low-power radio. The ESP32 has Wi-Fi built in, which makes it ideal for learning.

Third is the **ingestion and processing layer**: a server or cloud service that receives the data, stores it, and acts on it. This is usually where MQTT and a database live.

Fourth is the **application layer**: the dashboard, mobile app, or alert system a human actually interacts with.

A sensor reading flows up through these layers: the ESP32 measures temperature, sends it over Wi-Fi using MQTT to a broker in the cloud, which stores it and updates a dashboard you can view from anywhere.

## Why MQTT instead of HTTP?

You might wonder why IoT does not just use HTTP like the rest of the web. The answer is constraints. IoT devices are often small, battery-powered, and on unreliable networks. HTTP is relatively heavy: every request opens a connection, sends headers, and tears it down. Doing that thousands of times a day drains batteries and wastes bandwidth.

MQTT (Message Queuing Telemetry Transport) was designed for exactly these conditions. It is lightweight, keeps a single long-lived connection open, and uses a clever **publish/subscribe** model instead of request/response.

## The publish/subscribe model

In MQTT, devices do not talk to each other directly. Instead, a central server called a **broker** sits in the middle. Devices **publish** messages to named channels called **topics**, and other clients **subscribe** to the topics they care about. The broker delivers each message to every subscriber.

For example, your ESP32 publishes a temperature reading to a topic like `home/livingroom/temperature`. Your dashboard subscribes to that topic and receives every update automatically. The beauty is decoupling: the sensor does not know or care who is listening, and you can add more subscribers — a logger, a phone app, an alert service — without changing the device at all.

Topics are organised hierarchically with slashes, and subscribers can use wildcards. Subscribing to `home/livingroom/#` receives everything from that room, while `home/+/temperature` receives the temperature from every room.

## What you need to build a first project

To follow along practically you will want an **ESP32 development board**, a simple sensor such as a DHT22 (temperature and humidity), a USB cable, and the free **Arduino IDE** with ESP32 support installed. For the broker, you can use a free public test broker while learning, or run an open-source broker like Mosquitto, or use a managed cloud MQTT service.

## Connecting the ESP32 to Wi-Fi and the broker

The ESP32 is programmed in C++ using the Arduino framework. The structure of every sketch is the same: a `setup()` that runs once, and a `loop()` that runs forever. Here is the shape of a program that connects to Wi-Fi and an MQTT broker:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const char* broker = "test.mosquitto.org";

WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi connected");

  mqtt.setServer(broker, 1883);
  while (!mqtt.connected()) {
    mqtt.connect("esp32-client-01"); // a unique client id
  }
  Serial.println("MQTT connected");
}
```

The `PubSubClient` library handles the MQTT protocol details. You connect with a unique client id so the broker can tell your devices apart.

## Publishing a sensor reading

In the `loop()`, you read the sensor and publish the value to a topic at an interval. Note the call to `mqtt.loop()` — it keeps the connection alive and must run regularly.

```cpp
void loop() {
  mqtt.loop(); // maintain the connection

  float temperature = readTemperature(); // from your DHT22 sensor
  char payload[8];
  dtostrf(temperature, 1, 2, payload); // format the float as text

  mqtt.publish("home/livingroom/temperature", payload);
  Serial.print("Published: ");
  Serial.println(payload);

  delay(5000); // send every 5 seconds
}
```

On the receiving end, any MQTT client subscribed to `home/livingroom/temperature` now gets a new reading every five seconds, from anywhere in the world.

## Seeing your data

To verify it works, you can subscribe from your computer using the Mosquitto command-line tools:

```bash
# Subscribe and watch readings arrive in real time
mosquitto_sub -h test.mosquitto.org -t "home/livingroom/temperature"
```

Once data is flowing, the next step is storing it. A small program on a server can subscribe to the topic, write each reading into a database, and feed a dashboard that charts the temperature over time.

## Important considerations for real projects

**Security.** Public test brokers are open to everyone — never send private data through them. Real deployments use authentication (username and password) and TLS encryption, and often per-device certificates.

**Power.** If your device runs on a battery, use the ESP32's deep-sleep mode between readings. Sending data every few seconds drains a battery quickly; many real sensors wake, publish, and sleep for minutes or hours.

**Reliability.** Networks drop. Your code should reconnect automatically when Wi-Fi or the broker connection is lost, which is why connection logic belongs in a loop that retries.

## Common pitfalls

**Duplicate client ids.** Two devices using the same MQTT client id will keep disconnecting each other. Make each one unique.

**Blocking the loop.** Long `delay()` calls freeze the device. For anything beyond a simple demo, use non-blocking timing so the device can stay responsive.

**Forgetting `mqtt.loop()`.** Without it, the connection silently dies and your publishes stop arriving.

## Key takeaways

IoT systems are built from four layers — device, connectivity, processing, and application — and a sensor reading flows up through all of them. MQTT is the protocol of choice because it is lightweight and uses a publish/subscribe model through a central broker, which decouples your devices from whoever consumes their data. With an inexpensive ESP32, a sensor, and a broker, you can build a real system that streams live data to the cloud. Start with a public broker to learn, then add security, power management, and reliable reconnection as you move toward a real deployment.
