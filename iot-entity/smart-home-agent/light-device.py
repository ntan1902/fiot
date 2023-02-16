from threading import Thread, Event
from multiprocessing.connection import wait
from datetime import datetime
import paho.mqtt.client as mqtt
import random
import json

DEVICE_ID = "9b646fb4-c7a7-4d97-9ac3-8ecb1143b6ee"
DEVICE_TOKEN = "151dd6e0ebad09a4dc5e"

MAX_TEMPERATURE = 100

TOPIC_TELEMETRY_PUB = '/v1/devices/telemetry/request'
TOPIC_RPC_PUB = '/v1/server/rpc/response/'
TOPIC_RPC_SUB = '/v1/server/rpc/request/' + DEVICE_ID + "/"
HOST = 'fiot.me'
PORT = 1883

METHOD_TURN_ON = "turnOn"
METHOD_TURN_OFF = "turnOff"


def on_connect(client, userdata, flags, rc):
    sub_topic = TOPIC_RPC_SUB + "+"
    print('Subcribe topic: ', sub_topic)
    client.subscribe(sub_topic)


def on_message(client, userdata, message):
    msg_decode = str(message.payload.decode("utf-8", "ignore"))
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print("Time: ", current_time)
    print("Receive message: ", msg_decode)
    obj_msg = json.loads(msg_decode)

    control_device_rpc(obj_msg['method'])

    pub_topic = TOPIC_RPC_PUB + message.topic[len(TOPIC_RPC_SUB):]
    pub_msg = {
        "status": client.device_status
    }
    client.publish(pub_topic, json.dumps(pub_msg))


def publish_data():
    temperature = random.randrange(50, 100)
    has_people = temperature % 2 == 0
    msg = {
        "token": DEVICE_TOKEN,
        "json": {
            'temperature': temperature,
            "hasPeople": has_people,
        },
    }
    print('Device Sensor Data: ', {
            'temperature': temperature,
            "hasPeople": has_people,
    })

    client.publish(TOPIC_TELEMETRY_PUB, json.dumps(msg))


def update_device_status():
    if (client.device_status_old != client.device_status):
        print("DEVICE STATUS: ", client.device_status)
        client.device_status_old = client.device_status


def control_device_rpc(method):
    if (method == METHOD_TURN_ON):
        client.device_status = 1
    elif (method == METHOD_TURN_OFF):
        client.device_status = 0


# Extra flag for client
mqtt.Client.device_status = 0
mqtt.Client.device_status_old = 0

client = mqtt.Client()

client.on_connect = on_connect
client.on_message = on_message

client.connect(HOST, PORT)
client.loop_start()


def loop_publish_data(event):
    while not event.isSet():
        publish_data()
        event.wait(10)


def loop_update_device_status(event):
    while not event.isSet():
        update_device_status()
        event.wait(5)


event = Event()

threadA = Thread(target=loop_publish_data, args=(event,))
threadB = Thread(target=loop_update_device_status, args=(event,))

threadA.start()
threadB.start()

while not event.isSet():
    try:
        event.wait(0.75)
    except KeyboardInterrupt:
        event.set()
        break
