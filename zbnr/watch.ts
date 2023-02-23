import type {Server} from 'http';
import type {Express} from 'express';
import type {MqttClient} from 'mqtt';

import path from 'path';

import {watch} from './lib/watcher';

interface Services {
    app: Express,
    server: Server,
    mqttClient?: MqttClient,
}

let services: Services;

const buildPath = path.resolve('build');
const mainFilePath = path.resolve(buildPath, 'index.js');

async function restart() {
    if (services) {
        if (services.mqttClient) {
            await new Promise(res => services.mqttClient!.end(true, {}, res));
        }

        await new Promise(res => services.server.close(res));
    }

    return new Promise<void>(res => {
        require(mainFilePath).default((newServices: Services) => {
            services = newServices;

            res();
        });
    });
}

function handlePaths(): Promise<void> {
    return restart();
}

function index() {
    watch(handlePaths);
}

index();
