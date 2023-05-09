import type {Point} from '@/utils/algorithms/types';
import type {Algorithm} from '@/utils//algorithms/Algorithm';

import {algorithms} from '@/utils/algorithms';
import {analyzersRepository} from '@/repositories/analyzersRepository';
import {analyzersLogsRepository} from '@/repositories/analyzersLogsRepository';
import {server as socketIoServer} from '@/services/socket';

export const analyzeService = new class AnalyzeService {
    async analyze(data: Point[], code: string): Promise<Record<string, any> | null> {
        const analyzer = await analyzersRepository.getForAnalyze(code);

        // TODO normal error (maybe broadcast)
        if (!analyzer) {
            return null;
        }

        const AlgorithmClass: typeof Algorithm = algorithms[analyzer.algorithm];

        const network = AlgorithmClass.execute(data, {
            algorithmParameters: analyzer.algorithm_params,
        });

        const result = network.edges.length;

        // TODO
        // @ts-ignore
        const {analyzer_state_name, analyzer_state_value, maxValue} = analyzer.states.reduce<{
            analyzer_state_name: string,
            analyzer_state_value: number,
            minDistance: number,
            // TODO
            // @ts-ignore
        }>((res, {name, value}) => {
            const currentDistance = Math.abs(result - value);

            if (!res.minDistance || currentDistance < res.minDistance) {
                res.analyzer_state_name = name;
                res.analyzer_state_value = value;
                res.minDistance = currentDistance;
            }

            if (!res.maxValue || value > res.maxValue) {
                res.maxValue = value;
            }

            return res;
        }, {});

        const coefficient = Math.round(Math.min(result / maxValue, 1) * 100) / 100;

        const rawLog = {
            analyzer: {
                id: analyzer.id,
                name: analyzer.name,
                threshold: analyzer.threshold,
                code: code,
            },
            engine: {
                id: analyzer.engine_id,
                name: analyzer.engine_name,
            },
            algorithm: {
                algorithm: analyzer.algorithm,
                name: analyzer.algorithm_name,
                params: analyzer.algorithm_params,
            },
            value: result,
            coefficient,
            analyzer_state: {
                name: analyzer_state_name,
                value: analyzer_state_value,
            },
        };

        // const rawLog = {
        //     analyzer_id: analyzer.id,
        //     analyzer_name: analyzer.name,
        //     analyzer_threshold: analyzer.threshold,
        //     analyzer_code: code,
        //     engine_name: analyzer.engine_name,
        //     algorithm: analyzer.algorithm,
        //     algorithm_name: analyzer.algorithm_name,
        //     algorithm_params: analyzer.algorithm_params,
        //     value: result,
        //     analyzer_state_name,
        //     analyzer_state_value,
        // };

        socketIoServer.emit('analyze:end', rawLog);

        return rawLog;
        // return analyzersLogsRepository.create(rawLog);
    }
}
