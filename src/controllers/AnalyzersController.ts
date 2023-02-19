// TODO move logic to service layer
// TODO validate data
// TODO auth check

import type {Request, Response} from '@/types';

import {analyzersRepository} from '@/repositories/analyzersRepository';
import {Factory as BatchConverterFactory} from "@/services/BatchConverter/Factory";
import {analyzeService} from "@/services/analyzeService";
import {ConverterError} from "@/services/BatchConverter/ConverterError";

class AnalyzersController {
    async createOne(req: Request, res: Response) {
        const {
            engine_id: rawEngineId,
            algorithm_id: rawAlgorithmId,
            name,
            threshold: rawThreshold,
            code,
        } = req.body;

        // TODO replace user to real
        const creatorId = 1;
        const engineId = parseInt(rawEngineId);
        const algorithmId = parseInt(rawAlgorithmId);
        const threshold = parseInt(rawThreshold);
        const isCodeExists = await analyzersRepository.isCodeExists(code);

        if (isCodeExists) {
            return res.status(409).json({
                error: {
                    message: `Code "${code}" already used`,
                    meta: 'code',
                },
            });
        }

        const id = await analyzersRepository.create(creatorId, engineId, algorithmId, name, threshold, code);

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
        const analyzers = await analyzersRepository.getList(limit, offset);

        res.json({
            payload: analyzers,
        });
    }

    async getById(req: Request, res: Response) {
        const analyzerId = parseInt(req.params.analyzer_id);
        const analyzer = await analyzersRepository.getById(analyzerId);

        // TODO smart error
        if (!analyzer) {
            res.status(404).json({
                error: {
                    message: `Analyzer with id "${analyzerId}" not found`,
                    meta: 'id',
                },
            });

            return;
        }

        res.json({
            payload: analyzer,
        });
    }

    async updateById(req: Request, res: Response) {
        const {
            engine_id: rawEngineId,
            algorithm_id: rawAlgorithmId,
            name,
            threshold: rawThreshold,
            code,
            is_using,
        } = req.body;

        const analyzerId = parseInt(req.params.analyzer_id);
        const engineId = parseInt(rawEngineId);
        const algorithmId = parseInt(rawAlgorithmId);
        const threshold = parseInt(rawThreshold);
        const isCodeExists = await analyzersRepository.isCodeExists(code, analyzerId);

        if (isCodeExists) {
            return res.status(409).json({
                error: {
                    message: `Code "${code}" already used`,
                    meta: 'code',
                },
            });
        }

        await analyzersRepository.update(analyzerId, engineId, algorithmId, name, threshold, code, is_using);

        res.sendStatus(204);
    }

    async activateById(req: Request, res: Response) {
        const analyzerId = parseInt(req.params.analyzer_id);

        await analyzersRepository.activate(analyzerId, req.body.is_using);

        res.sendStatus(204);
    }

    async deleteById(req: Request, res: Response) {
        const analyzerId = parseInt(req.params.analyzer_id);
        const error = await analyzersRepository.delete(analyzerId);

        if (error) {
            return res.status(409).json({
                error: {
                    message: `Analyzer with id "${analyzerId}" used by some entities`,
                },
            });
        }

        res.sendStatus(204);
    }

    async data({}, res: Response) {
        // const thresholdKey = `analyzer-${code}-threshold`;
        // const redisThreshold = await Cache.get(thresholdKey);
        // let threshold: number;
        //
        // if (!redisThreshold) {
        //     const dbThreshold = await analyzersRepository.getThresholdByCode(code);
        //
        //     // TODO smart error
        //     if (!dbThreshold) {
        //         res.status(404).json({
        //             error: {
        //                 message: `Analyzer with code "${code}" not found'`,
        //                 meta: 'code',
        //             }
        //         });
        //
        //         return;
        //     }
        //
        //     threshold = dbThreshold!;
        //     await Cache.set(thresholdKey, threshold);
        //     await Cache.expire(thresholdKey, ENGINE_DATA_EXPIRES);
        // } else {
        //     threshold = parseInt(redisThreshold);
        // }
        //
        // const dataKey = `analyzer-${code}-data`;
        // const dataCount = await Cache.push(dataKey, value);
        //
        // EventEmitter.dispatch('analyzer:new_data', value);
        //
        // if (dataCount >= threshold) {
        //     EventEmitter.dispatch('analyzer:data_ready', code);
        // } else {
        //     await Cache.expire(dataKey, ENGINE_DATA_EXPIRES);
        // }
        //
        // res.json({
        //     payload: dataCount,
        // });
        res.status(503).json({
            error: {
                message: 'Not implemented',
            },
        });
    }

    async batch(req: Request, res: Response) {
        const {
            code,
            data,
            type,
            options = {},
        } = req.body;

        try {
            const converter = BatchConverterFactory.make(type, options);
            const converted = converter.convert(data);
            const result = await analyzeService.analyze(converted, code);

            res.json({
                payload: result,
            });
        } catch (error) {
            if (error instanceof ConverterError) {
                res.json({
                    error: {
                        message: error.message,
                        meta: 'data',
                    },
                });

                return;
            }

            throw error;
        }
    }
}

export {AnalyzersController};
