import {Repository} from './Repository';

const analyzersLogsRepository = new class AnalyzersLogsRepository extends Repository {
    // TODO to model
    // TODO normal returning ?
    async create(fields: Record<string, any>): Promise<any> {
        const {fieldsArray, valuesArray, params} = Object.entries(fields).reduce<{
            fieldsArray: string[],
            valuesArray: string[],
            params: any[],
        }>((res, [key, value]) => {
            res.fieldsArray.push(key);
            res.params.push(value);
            res.valuesArray.push(`$${res.params.length}`);

            return res;
        }, {fieldsArray: [], valuesArray: [], params: []});

        const fieldsString = fieldsArray.join(',');
        const valuesString = valuesArray.join(',');

        const {rows: [log]} = await this.client.query(
            `insert into analyzers_logs(${fieldsString})
             values (${valuesString}) returning *`,
            params
        );

        return log;
    }

    // TODO to model
    async getListByAnalyzerId(analyzerId: number, limit: number, offset: number): Promise<Record<string, any>> {
        const {rows: rawAnalyzerLogs} = await this.client.query<{
            id: number,
            analyzer_name: string,
            engine_name: string,
            algorithm: string,
            algorithm_name: string,
            value: number,
            analyzer_state_name: string,
            analyzer_state_value: number,
            created_at: number,
        }>(
            `select id::integer, analyzer_name,
                    engine_name,
                    algorithm,
                    algorithm_name,
                    value,
                    analyzer_state_name,
                    analyzer_state_value,
                    created_at::integer
             from analyzers_logs
             where analyzer_id = $1
             order by id desc
                 limit $2
             offset $3`,
            [analyzerId, limit, offset]
        );

        // TODO smart group
        const analyzerLogs = rawAnalyzerLogs.map(
            ({
                 analyzer_name,
                 engine_name,
                 algorithm, algorithm_name,
                 analyzer_state_name, analyzer_state_value,
                 ...rest
             }) => ({
                ...rest,
                analyzer: {
                    name: analyzer_name,
                },
                engine: {
                    name: engine_name,
                },
                algorithm: {
                    algorithm: algorithm,
                    name: algorithm_name,
                },
                analyzer_state: {
                    name: analyzer_state_name,
                    value: analyzer_state_value,
                },
            })
        );

        return analyzerLogs;
    }

    // TODO to model
    async getById(id: number): Promise<Record<string, any> | null> {
        const {rows: [rawAnalyzerLog]} = await this.client.query<{
            id: number,
            analyzer_name: string,
            analyzer_threshold: number,
            analyzer_code: string,
            engine_name: string,
            algorithm: string,
            algorithm_name: string,
            algorithm_params: Record<string, any>,
            value: number,
            analyzer_state_name: string,
            analyzer_state_value: number,
            created_at: number,
        }>(
            `select id::integer, analyzer_name,
                    analyzer_threshold::integer, analyzer_code,
                    engine_name,
                    algorithm,
                    algorithm_name,
                    algorithm_params,
                    value,
                    analyzer_state_name,
                    analyzer_state_value,
                    created_at::integer
             from analyzers_logs
             where id = $1 limit 1`,
            [id]
        );

        if (!rawAnalyzerLog) {
            return null;
        }

        // TODO smart group
        const {
            analyzer_name, analyzer_threshold, analyzer_code,
            engine_name,
            algorithm, algorithm_name, algorithm_params,
            analyzer_state_name, analyzer_state_value,
            ...rest
        } = rawAnalyzerLog;

        const analyzerLog = {
            ...rest,
            analyzer: {
                name: analyzer_name,
                threshold: analyzer_threshold,
                code: analyzer_code,
            },
            engine: {
                name: engine_name,
            },
            algorithm: {
                algorithm: algorithm,
                name: algorithm_name,
                params: algorithm_params,
            },
            analyzer_state: {
                name: analyzer_state_name,
                value: analyzer_state_value,
            },
        };

        return analyzerLog;
    }
}

export {analyzersLogsRepository};
