import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {StatesController} from '@/controllers/StatesController';

import {ANALYZERS_ONE_URI} from './analyzers';

const STATES_URI = `${ANALYZERS_ONE_URI}/states`;
const STATES_ONE_URI = `${STATES_URI}/:state_id`;

function states(app: Express) {
    const statesController = decoratedController(new StatesController);

    // ==================== STATES ====================
    app.post(STATES_URI, statesController.createOne);
    app.put(STATES_ONE_URI, statesController.updateById);
    app.delete(STATES_ONE_URI, statesController.deleteById);
}

export {states};

