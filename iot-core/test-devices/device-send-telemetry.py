import paho.mqtt.client as mqtt
from time import sleep
import random

import json
# import geocoder
# import pyttsx3
#
# engine = pyttsx3.init()
# engine.say("Whetever you want the program to say")
# engine.runAndWait()

TOPIC_PUB = '/v1/devices/telemetry/request'
# TOPIC_SUB = '/v1/device/telemetry/response'
HOST = 'localhost'
PORT = 1883

def on_connect(client, userdata, flags, rc):
    print("rc_code:", rc)
    # client.subscribe(TOPIC_SUB)

def on_message(client, userdata, message):
    print("Topic: " + message.topic + "\nMessage: " + str(message.payload.decode('utf-8')))

client = mqtt.Client()

client.on_connect = on_connect
# client.on_message = on_message

client.connect(HOST, PORT)
client.loop_start()

while True:
    x = random.randrange(-20, 80)
    latitude = g.latlng[0]
    longitude = g.latlng[1]

    msg = {
        "token": "b105b10f1ad550b81fb0",
        "json": {
            "temperature": x,
        },
    }
    print(msg)
    
    client.publish(TOPIC_PUB, json.dumps(msg))

    sleep(1.5)
