import type {Server} from 'http';
import type {Express} from 'express';

import path from 'path';

import {watch} from './lib/watcher';

interface Services {
    app: Express,
    server: Server,
}

let services: Services;

const buildPath = path.resolve('build');
const mainFilePath = path.resolve(buildPath, 'index.js');

async function restart() {
    if (services) {
        await new Promise(res => services.server!.close(res));
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
