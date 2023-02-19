// TODO move logic to service layer
// TODO validate data
// TODO auth check

import type {Request, Response} from '@/types';

import {getData} from '@/utils/http/getData';
import {enginesDataService} from '@/services/enginesDataService';

class EnginesDataController {
    async createOne(req: Request, res: Response) {
        const body = getData(req, [
            'value',
            'engine_id',
            'anchor',
        ]);

        if ('value' in body && typeof body.value !== 'number') {
            body.value = Number(body.value);
        }

        if ('engine_id' in body && typeof body.engine_id !== 'number') {
            body.engine_id = Number(body.engine_id);
        }

        const [error, id] = await enginesDataService.createOne(body);

        if (error === 1) {
            res.status(400).json({
                error: {
                    message: 'Key "engine_id" or "anchor" not found',
                },
            });

            return;
        }

        res.json({
            payload: id,
        });
    }
}

export {EnginesDataController};
