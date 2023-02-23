import type {Response} from '@/types';

import {promises} from 'fs';

class OtherController {
    async index({}, res: Response): Promise<void> {
        const rawPackage = await promises.readFile('package.json', 'utf8');
        const {version} = JSON.parse(rawPackage);

        res.json({
            payload: {version},
        });
    }
}

export {OtherController};
