import type {Response} from '@/types';

import {promises} from 'fs';

import {testMode as mqttTestMode} from '@/services/mqtt/testMode';

class OtherController {
    async index({}, res: Response): Promise<void> {
        const rawPackage = await promises.readFile('package.json', 'utf8');
        const {version} = JSON.parse(rawPackage);

        res.json({
            payload: {version},
        });
    }

    async mqttTestModeEnable({}, res: Response): Promise<void> {
        const error = await mqttTestMode().enable();

        if (error) {
            res.status(400).json({
                error: {
                    message: error.message,
                },
            });

            return;
        }

        res.sendStatus(200);
    }

    async mqttTestModeDisable({}, res: Response): Promise<void> {
        const error = await mqttTestMode().disable();

        if (error) {
            res.status(400).json({
                error: {
                    message: error.message,
                },
            });

            return;
        }

        res.sendStatus(200);
    }

    async mqttTestModeIsEnabled({}, res: Response): Promise<void> {
        res.json({
            payload: mqttTestMode().isEnabled(),
        });
    }
}

export {OtherController};
