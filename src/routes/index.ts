import type {Express} from 'express';

import {shared} from './shared';
import {engines} from './engines';
import {algorithms} from './algorithms';
import {analyzers} from './analyzers';
import {states} from './states';
import {logs} from './logs';
import {other} from './other';
import {docs} from './docs';

function routes(app: Express) {
    shared(app);
    engines(app);
    algorithms(app);
    analyzers(app);
    states(app);
    logs(app);
    other(app);
    docs(app);
}

export {routes};
