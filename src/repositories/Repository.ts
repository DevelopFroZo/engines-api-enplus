import type {Pool} from 'pg';

import {client} from '@/db/client';

class Repository {
    protected get client(): Pool {
        return client;
    }
}

export {Repository};
