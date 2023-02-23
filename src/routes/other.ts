import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {OtherController} from '@/controllers/OtherController';

function other(app: Express) {
    const otherController = decoratedController(new OtherController);

    // ==================== INDEX ====================
    app.get('/', otherController.index);
}

export {other};
