// TODO move logic to service layer
// TODO validate data
// TODO auth check

import type {Request, Response} from '@/types';

import {algorithmsRepository} from '@/repositories/algorithmsRepository';

import {algorithms} from '@/utils/algorithms';
import algorithmsConfig from '@/configs/algorithms';

class AlgorithmsController {
    async createOne(req: Request, res: Response) {
        const {
            algorithm: rawAlgorithm,
            name,
            params,
        } = req.body;

        // TODO replace user to real
        const creatorId = 1;
        const algorithm = rawAlgorithm.toLowerCase();

        // TODO smart error
        if (!(algorithm in algorithms)) {
            return res.status(422).json({
                error: {
                    message: `Unsupported algorithm "${rawAlgorithm}"`,
                    localCode: 1,
                    meta: 'algorithm',
                },
            });
        }

        const id = await algorithmsRepository.create(creatorId, algorithm, name, params);

        res.json({
            payload: id,
        });
    }

    async getConfigs({}, res: Response) {
        const algorithms = algorithmsConfig().configs;

        res.json({
            payload: algorithms,
        });
    }

    async getList(req: Request, res: Response) {
        const {
            limit: rawLimit,
            offset: rawOffset,
        } = req.query;

        const limit = rawLimit ? parseInt(rawLimit as string) : 5;
        const offset = rawOffset ? parseInt(rawOffset as string) : 0;
        const algorithms = await algorithmsRepository.getList(limit, offset);

        res.json({
            payload: algorithms,
        });
    }

    async getById(req: Request, res: Response) {
        const algorithmId = parseInt(req.params.algorithm_id);
        const algorithm = await algorithmsRepository.getById(algorithmId);

        // TODO smart error
        if (!algorithm) {
            return res.status(404).json({
                error: {
                    message: `Algorithm with id "${algorithmId}" not found`,
                    localCode: 1,
                    meta: 'id',
                },
            });
        }

        res.json({
            payload: algorithm,
        });
    }

    async updateById(req: Request, res: Response) {
        const {
            algorithm: rawAlgorithm,
            name,
            params,
        } = req.body;

        const algorithm = rawAlgorithm.toLowerCase();

        // TODO smart error
        if (!(algorithm in algorithms)) {
            res.status(422).json({
                error: {
                    message: `Unsupported algorithm "${rawAlgorithm}"`,
                    localCode: 1,
                    meta: 'algorithm',
                },
            });

            return;
        }

        const algorithmId = parseInt(req.params.algorithm_id);

        await algorithmsRepository.update(algorithmId, algorithm, name, params);

        res.sendStatus(204);
    }

    async deleteById(req: Request, res: Response) {
        const algorithmId = parseInt(req.params.algorithm_id);
        const error = await algorithmsRepository.delete(algorithmId);

        if (error) {
            return res.status(409).json({
                error: {
                    message: `Algorithm with id "${algorithmId}" used by some entities`,
                },
            });
        }

        res.sendStatus(204);
    }
}

export {AlgorithmsController};
