import type {Express} from 'express';

import {shared} from './shared';
import {decoratedController} from '@/utils/decoratedController';

import {allowedMethods} from '@/middlewares/allowedMethods';
import {authApiToken} from '@/middlewares/authApiToken';

import {IndexController} from '@/controllers/IndexController';
import {EnginesController} from '@/controllers/EnginesController';
import {EnginesDataController} from '@/controllers/EnginesDataController';
import {AlgorithmsController} from '@/controllers/AlgorithmsController';
import {AnalyzersController} from '@/controllers/AnalyzersController';
import {StatesController} from '@/controllers/StatesController';
import {LogsController} from '@/controllers/LogsController';

const ENGINES_URI = '/engines';
const ENGINES_ONE_URI = `${ENGINES_URI}/:engine_id`;
const ENGINES_DATA_URI = `${ENGINES_URI}/data`;
const ALGORITHMS_URI = '/algorithms';
const ALGORITHMS_ONE_URI = `${ALGORITHMS_URI}/:algorithm_id`;
const ANALYZERS_URI = '/analyzers';
const ANALYZERS_ONE_URI = `${ANALYZERS_URI}/:analyzer_id`;
const STATES_URI = `${ANALYZERS_ONE_URI}/states`;
const STATES_ONE_URI = `${STATES_URI}/:state_id`;
const LOGS_URI = `${ANALYZERS_ONE_URI}/logs`;
const LOGS_ONE_URI = `${LOGS_URI}/:log_id`;

function routes(app: Express) {
    const indexController = decoratedController(new IndexController);
    const enginesController = decoratedController(new EnginesController);
    const enginesDataController = decoratedController(new EnginesDataController);
    const algorithmsController = decoratedController(new AlgorithmsController);
    const analyzersController = decoratedController(new AnalyzersController);
    const statesController = decoratedController(new StatesController);
    const logsController = decoratedController(new LogsController);

    shared(app);

    // ==================== ENGINES DATA ====================
    app.use(
        ENGINES_DATA_URI,
        allowedMethods('get', 'post'),
        authApiToken,
        enginesDataController.createOne
    );

    // ==================== INDEX ====================
    app.get('/', indexController.index);

    // ==================== ENGINES ====================
    app.post(ENGINES_URI, enginesController.createOne);
    app.get(ENGINES_URI, enginesController.getList);
    app.get(ENGINES_ONE_URI, enginesController.getById);
    app.put(ENGINES_ONE_URI, enginesController.updateById);
    app.delete(ENGINES_ONE_URI, enginesController.deleteById);

    // ==================== ALGORITHMS ====================
    app.post(ALGORITHMS_URI, algorithmsController.createOne);
    app.get(`${ALGORITHMS_URI}/configs`, algorithmsController.getConfigs);
    app.get(ALGORITHMS_URI, algorithmsController.getList);
    app.get(ALGORITHMS_ONE_URI, algorithmsController.getById);
    app.put(ALGORITHMS_ONE_URI, algorithmsController.updateById);

    // ==================== ANALYZERS ====================
    app.post(ANALYZERS_URI, analyzersController.createOne);
    app.get(ANALYZERS_URI, analyzersController.getList);
    app.get(ANALYZERS_ONE_URI, analyzersController.getById);
    app.put(ANALYZERS_ONE_URI, analyzersController.updateById);
    app.put(`${ANALYZERS_ONE_URI}/activate`, analyzersController.activateById);
    app.delete(ANALYZERS_ONE_URI, analyzersController.deleteById);
    app.post(`${ANALYZERS_URI}/data`, analyzersController.data);
    app.post(`${ANALYZERS_URI}/batch`, analyzersController.batch);

    // ==================== STATES ====================
    app.post(STATES_URI, statesController.createOne);
    app.put(STATES_ONE_URI, statesController.updateById);
    app.delete(STATES_ONE_URI, statesController.deleteById);

    // ==================== LOGS ====================
    app.get(LOGS_URI, logsController.getList);
    app.get(LOGS_ONE_URI, logsController.getById);
}

export {routes};
