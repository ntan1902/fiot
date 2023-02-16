from threading import Thread, Event
import paho.mqtt.client as mqtt
from time import sleep
import random
import json

DEVICE_ID = "0cb048f3-518d-496c-a8f2-30298e93127b"
DEVICE_TOKEN = "742ceb977a26bbdd54c5"

DESIRE_TEMPERATURE = 26

TOPIC_TELEMETRY_PUB = '/v1/devices/telemetry/request'
TOPIC_RPC_PUB = '/v1/server/rpc/response'
TOPIC_RPC_SUB = '/v1/server/rpc/request/' + DEVICE_ID + "/"
HOST = 'fiot.me'
PORT = 1883

METHOD_TURN_ON = "turnOn"
METHOD_TURN_OFF = "turnOff"
METHOD_ADJUST_TEMPERATURE = "adjustTemperature"


def on_connect(client, userdata, flags, rc):
    sub_topic = TOPIC_RPC_SUB + "+"
    print('Subcribe topic: ', sub_topic)
    client.subscribe(sub_topic)


def on_message(client, userdata, message):
    msg_decode = str(message.payload.decode("utf-8", "ignore"))
    print('Receive msg: ', msg_decode)
    obj_msg = json.loads(msg_decode)
    control_device_rpc(obj_msg['method'], obj_msg['params'])

    pub_topic = TOPIC_RPC_PUB + message.topic[len(TOPIC_RPC_SUB):]
    pub_msg = {
        "status": client.device_status,
        "temperature": client.device_temperature
    }
    client.publish(pub_topic, json.dumps(pub_msg))


def publish_data():
    temperature = random.randrange(0, 100)
    has_people = temperature % 2 == 0
    msg = {
        "token": DEVICE_TOKEN,
        "json": {
            'temperature': temperature,
            "hasPeople": has_people,
            "status": client.device_status
        },
    }
    print('Device Sensor Data: ', msg)
    client.device_temperature = temperature
    client.publish(TOPIC_TELEMETRY_PUB, json.dumps(msg))


def update_device_status():
    #if (client.device_status_old != client.device_status):
        print("DEVICE STATUS", client.device_status)
        client.device_status_old = client.device_status
    #if (client.device_status == 1 and client.device_temperature != client.device_temperature_old):
        print("DEVICE TEMPERATURE", client.device_temperature)
        client.device_temperature_old = client.device_temperature


def control_device_rpc(method, param):
    if (method == METHOD_TURN_ON):
        client.device_status = 1
    elif (method == METHOD_TURN_OFF):
        client.device_status = 0
    elif (method == METHOD_ADJUST_TEMPERATURE):
        obj_param = json.loads(param)
        client.device_temperature = int(obj_param['temperature'])


# Extra flag for client
mqtt.Client.device_status = 0
mqtt.Client.device_status_old = 0
mqtt.Client.device_temperature = DESIRE_TEMPERATURE
mqtt.Client.device_temperature_old = DESIRE_TEMPERATURE


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
