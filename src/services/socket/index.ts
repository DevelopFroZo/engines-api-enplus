import type {Server} from 'http';

import {Server as SocketIOServer} from 'socket.io';

let io: SocketIOServer;

const server = new Proxy(new class {}, {
    get(target: {}, p: string | symbol): any {
        const property = Reflect.get(io, p);

        if (typeof property === 'function') {
            return property.bind(io);
        }

        return property;
    }
}) as SocketIOServer;

function initialize(server: Server): void {
    io = new SocketIOServer(server, {
        cors: {
            origin: '*',
        },
    });

    console.log('[SOCKET] Initialized');
}

export {
    initialize,
    server,
};
