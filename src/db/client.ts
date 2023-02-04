import {Pool} from 'pg';

import dbConfig from '@/configs/db';

let client: Pool;

function initialize(): void {
    const {
        user,
        password,
        host,
        port: rawPort,
        database,
    } = dbConfig();

    const port = Number(rawPort);

    client = new Pool({user, password, host, port, database});
}

export {
    client,
    initialize,
};
