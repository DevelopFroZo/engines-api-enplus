import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {IndexController} from '@/controllers/IndexController';

import {shared} from './shared';
import {engines} from './engines';
import {algorithms} from './algorithms';
import {analyzers} from './analyzers';
import {states} from './states';
import {logs} from './logs';

function routes(app: Express) {
    const indexController = decoratedController(new IndexController);

    shared(app);

    // ==================== INDEX ====================
    app.get('/', indexController.index);

    engines(app);
    algorithms(app);
    analyzers(app);
    states(app);
    logs(app);
}

export {routes};
