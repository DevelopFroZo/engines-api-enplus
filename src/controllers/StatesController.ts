// TODO
import type {Request, Response} from '@/types';

import {client} from '@/db/client';

class StatesController {
    async createOne(req: Request, res: Response) {
        const analyzerId = parseInt(req.params.analyzer_id);
        const rawValues = [];
        const params: any[] = [analyzerId];

        for (const {name, value} of req.body) {
            rawValues.push([params.length + 1, params.length + 2]);
            params.push(name, value);
        }

        const values = rawValues.map(([nameIndex, valueIndex]) => `($1, $${nameIndex}, $${valueIndex})`);

        const {rows: rawIds} = await client.query<{
            id: string,
        }>(
            `insert into analyzers_states(analyzer_id, name, value)
             values ${values} returning id`,
            params
        );

        const ids = rawIds.map(({id}) => parseInt(id));

        res.json({
            payload: ids,
        });
    }

    // TODO
    async updateById({}: Request, res: Response) {
        res.status(503).json({
            error: {
                message: 'Not implemented',
            },
        });
    }

    async deleteById(req: Request, res: Response) {
        const stateId = parseInt(req.params.state_id);

        try {
            await client.query(
                `delete
                 from analyzers_states
                 where id = $1`,
                [stateId]
            );

            res.sendStatus(204);
        } catch (e: any) {
            if (e.code === '23503') {
                return res.status(409).json({
                    error: {
                        message: `Analyzer state with id "${stateId}" used by some entities`,
                    },
                });
            }

            throw e;
        }
    }
}

export {StatesController};
