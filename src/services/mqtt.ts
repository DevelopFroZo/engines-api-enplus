import type {MqttClient} from 'mqtt';

import mqtt from 'mqtt';

import mqttConfig from '@/configs/mqtt';

let nativeClient: MqttClient;

function initialize() {
    const {
        protocol,
        host,
        port,
        username,
        password,
    } = mqttConfig();

    // @ts-ignore
    nativeClient = mqtt.connect({
        protocol,
        host,
        port,
        username,
        password,
    });
}

function client() {
    return nativeClient;
}

export {
    initialize,
    client,
};
