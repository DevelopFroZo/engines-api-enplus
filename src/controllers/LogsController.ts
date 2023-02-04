import type {Request, Response} from '@/types';

import {analyzersLogsRepository} from '@/repositories/analyzersLogsRepository';

class LogsController {
    async getList(req: Request, res: Response) {
        const {
            limit: rawLimit,
            offset: rawOffset,
        } = req.query;

        const analyzerId = parseInt(req.params.analyzer_id);
        const limit = rawLimit ? parseInt(rawLimit as string) : 5;
        const offset = rawOffset ? parseInt(rawOffset as string) : 0;
        const analyzerLogs = await analyzersLogsRepository.getListByAnalyzerId(analyzerId, limit, offset);

        res.json({
            payload: analyzerLogs,
        });
    }

    async getById(req: Request, res: Response) {
        const logId = parseInt(req.params.log_id);
        const analyzerLog = await analyzersLogsRepository.getById(logId);

        // TODO smart error
        if (!analyzerLog) {
            res.status(404).json({
                error: {
                    message: `Analyzer log with id "${logId}" not found`,
                    localCode: 1,
                    meta: 'id',
                },
            });

            return;
        }

        res.json({
            payload: analyzerLog,
        });
    }
}

export {LogsController};
