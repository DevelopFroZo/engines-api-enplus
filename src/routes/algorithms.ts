import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {AlgorithmsController} from '@/controllers/AlgorithmsController';

const ALGORITHMS_URI = '/algorithms';
const ALGORITHMS_ONE_URI = `${ALGORITHMS_URI}/:algorithm_id`;

function algorithms(app: Express) {
    const algorithmsController = decoratedController(new AlgorithmsController);

    // ==================== ALGORITHMS ====================
    app.post(ALGORITHMS_URI, algorithmsController.createOne);
    app.get(`${ALGORITHMS_URI}/configs`, algorithmsController.getConfigs);
    app.get(ALGORITHMS_URI, algorithmsController.getList);
    app.get(ALGORITHMS_ONE_URI, algorithmsController.getById);
    app.put(ALGORITHMS_ONE_URI, algorithmsController.updateById);
}

export {algorithms};
