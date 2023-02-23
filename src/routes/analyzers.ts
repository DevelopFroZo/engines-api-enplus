import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {AnalyzersController} from '@/controllers/AnalyzersController';

const ANALYZERS_URI = '/analyzers';
const ANALYZERS_ONE_URI = `${ANALYZERS_URI}/:analyzer_id`;

function analyzers(app: Express) {
    const analyzersController = decoratedController(new AnalyzersController);

    // ==================== ANALYZERS ====================
    app.post(ANALYZERS_URI, analyzersController.createOne);
    app.get(ANALYZERS_URI, analyzersController.getList);
    app.get(ANALYZERS_ONE_URI, analyzersController.getById);
    app.put(ANALYZERS_ONE_URI, analyzersController.updateById);
    app.put(`${ANALYZERS_ONE_URI}/activate`, analyzersController.activateById);
    app.delete(ANALYZERS_ONE_URI, analyzersController.deleteById);
    app.post(`${ANALYZERS_URI}/data`, analyzersController.data);
    app.post(`${ANALYZERS_URI}/batch`, analyzersController.batch);
}

export {
    analyzers,
    ANALYZERS_ONE_URI,
};
