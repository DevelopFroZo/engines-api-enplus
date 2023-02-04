import type {Response} from 'express';

import {promises} from 'fs';

class IndexController {
    async index({}, res: Response) {
        const rawPackage = await promises.readFile('package.json', 'utf8');
        const {version} = JSON.parse(rawPackage);

        res.json({
            version,
        });
    }
}

export {IndexController};
