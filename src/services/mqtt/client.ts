import type {MqttClient} from 'mqtt';

import mqtt from 'mqtt';

import mqttConfig from '@/configs/mqtt';

let nativeClient: MqttClient;

const client = new Proxy(new class {}, {
    get(target: {}, p: string | symbol): any {
        const property = Reflect.get(nativeClient, p);

        if (typeof property === 'function') {
            return property.bind(nativeClient);
        }

        return property;
    },
}) as MqttClient;

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

export {
    initialize,
    client,
};
