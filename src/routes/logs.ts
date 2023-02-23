import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {LogsController} from '@/controllers/LogsController';

import {ANALYZERS_ONE_URI} from './analyzers';

const LOGS_URI = `${ANALYZERS_ONE_URI}/logs`;
const LOGS_ONE_URI = `${LOGS_URI}/:log_id`;

function logs(app: Express) {
    const logsController = decoratedController(new LogsController);

    // ==================== LOGS ====================
    app.get(LOGS_URI, logsController.getList);
    app.get(LOGS_ONE_URI, logsController.getById);
}

export {logs};
