import {createServer} from 'http';

import express from 'express';
import dotenv from 'dotenv';
// import helmet from 'helmet';
// import session from 'express-session';
// import pgStoreConnect from 'connect-pg-simple';

import {initialize as initializeDb} from '@/db/client';
import {initialize as initializeMqttClient, client as mqttClient} from '@/services/mqtt/client';
import {routes} from '@/routes';

function index(initialize?: Function) {
    const PORT = Number(process.env.PORT || process.argv[2] || '3000');
    const NODE_ENV = process.env.NODE_ENV || process.argv[3] || 'development';

    // try {
    //     initConfigs(NODE_ENV!, {
    //         root: 'configs',
    //         preset: NODE_PRESET,
    //     });
    //
    //     await initPool();
    //     await initRedis();
    // } catch (error: any) {
    //     console.error('!!! Failed to load configuration or init database pool !!!');
    //     console.error(error.message);
    //     console.error(error);
    //
    //     process.exit(-1);
    // }

    // const pgStore = pgStoreConnect( session );
    const app = express();
    const server = createServer(app);

    dotenv.config();
    initializeDb();
    initializeMqttClient();
    routes(app);

    server.listen(PORT, () => {
        console.log(`Started ${NODE_ENV} server on port ${PORT}`);

        initialize && initialize({app, server, mqttClient});
    });
}

export default index;
