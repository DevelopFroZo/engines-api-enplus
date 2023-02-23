import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {allowedMethods} from '@/middlewares/allowedMethods';
import {authApiToken} from '@/middlewares/authApiToken';

import {EnginesController} from '@/controllers/EnginesController';
import {EnginesDataController} from '@/controllers/EnginesDataController';

const ENGINES_URI = '/engines';
const ENGINES_ONE_URI = `${ENGINES_URI}/:engine_id`;
const ENGINES_DATA_URI = `${ENGINES_URI}/data`;

function engines(app: Express) {
    const enginesController = decoratedController(new EnginesController);
    const enginesDataController = decoratedController(new EnginesDataController);

    // ==================== ENGINES DATA ====================
    app.use(
        ENGINES_DATA_URI,
        allowedMethods('get', 'post'),
        authApiToken,
        enginesDataController.createOne
    );

    // ==================== ENGINES ====================
    app.post(ENGINES_URI, enginesController.createOne);
    app.get(ENGINES_URI, enginesController.getList);
    app.get(ENGINES_ONE_URI, enginesController.getById);
    app.put(ENGINES_ONE_URI, enginesController.updateById);
    app.delete(ENGINES_ONE_URI, enginesController.deleteById);
}

export {engines};
