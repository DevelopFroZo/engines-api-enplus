import type {Express} from 'express';

import {decoratedController} from '@/utils/decoratedController';

import {authApiToken} from '@/middlewares/authApiToken';

import {OtherController} from '@/controllers/OtherController';

function other(app: Express) {
    const otherController = decoratedController(new OtherController);

    // ==================== INDEX ====================
    app.get('/', otherController.index);

    // ==================== MQTT TEST MODE ====================
    app.get('/mqtt-test-mode/enable', authApiToken, otherController.mqttTestModeEnable);
    app.get('/mqtt-test-mode/disable', authApiToken, otherController.mqttTestModeDisable);
    app.get('/mqtt-test-mode/is-enabled', authApiToken, otherController.mqttTestModeIsEnabled);
}

export {other};
