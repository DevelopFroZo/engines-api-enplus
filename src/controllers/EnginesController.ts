// TODO move logic to service layer
// TODO validate data
// TODO auth check

import type {Request, Response} from '@/types';

import {enginesRepository} from '@/repositories/enginesRepository';

class EnginesController {
    async createOne(req: Request, res: Response) {
        // TODO replace user to real
        const creatorId = 1;

        const id = await enginesRepository.create(creatorId, req.body.name);

        res.json({
            payload: id,
        });
    }

    async getList(req: Request, res: Response) {
        const {
            limit: rawLimit,
            offset: rawOffset,
        } = req.query;

        const limit = rawLimit ? parseInt(rawLimit as string) : 5;
        const offset = rawOffset ? parseInt(rawOffset as string) : 0;
        const engine = await enginesRepository.getList(limit, offset);

        res.json({
            payload: engine,
        });
    }

    async getById(req: Request, res: Response) {
        const engineId = parseInt(req.params.engine_id);
        const engine = await enginesRepository.getById(engineId);

        // TODO smart error
        if (!engine) {
            return res.status(404).json({
                error: {
                    message: `Engine with id "${engineId}" not found`,
                    meta: 'id',
                },
            });
        }

        res.json({
            payload: engine,
        });
    }

    async updateById(req: Request, res: Response) {
        const engineId = parseInt(req.params.engine_id);

        await enginesRepository.update(engineId, req.body.name);

        res.sendStatus(204);
    }

    async deleteById(req: Request, res: Response) {
        const engineId = parseInt(req.params.engine_id);
        const error = await enginesRepository.delete(engineId);

        if (error) {
            return res.status(409).json({
                error: {
                    message: `Engine with id "${engineId}" used by some entities`,
                },
            });
        }

        res.sendStatus(204);
    }
}

export {EnginesController};
