import {Repository} from './Repository';

const analyzersRepository = new class AnalyzersRepository extends Repository {
    async isCodeExists(code: string, id?: number): Promise<boolean> {
        const whereArray = ['code = $1'];
        const params: any[] = [code];

        if (id) {
            whereArray.push('id != $2');
            params.push(id);
        }

        const whereString = whereArray.join(' and ');

        const {rowCount} = await this.client.query(
            `select 1
             from analyzers
             where ${whereString} limit 1`,
            params
        );

        return rowCount === 1;
    }

    async create(creatorId: number, engineId: number, algorithmId: number, type: string, name: string, threshold: number, code: string): Promise<number> {
        const {rows: [{id}]} = await this.client.query<{
            id: number,
        }>(
            `insert into analyzers(engine_id, algorithm_id, creator_id, type, name, threshold, code, is_using)
             values ($1, $2, $3, $4, $5, $6, $7, false) returning id::integer`,
            [engineId, algorithmId, creatorId, type, name, threshold, code]
        );

        return id;
    }

    // TODO to model
    async getList(limit: number, offset: number): Promise<Record<string, any>> {
        const {rows: rawAnalyzers} = await this.client.query<{
            id: number,
            name: string,
            is_using: boolean,
            engine_name: string,
            algorithm_algorithm: string,
            algorithm_name: string,
            last_analyze_name: string,
            last_analyze_created_at: number,
        }>(
            `select an.id::integer, an.name,
                    an.is_using,
                    e.name                  as engine_name,
                    al.algorithm            as algorithm_algorithm,
                    al.name                 as algorithm_name,
                    alo.analyzer_state_name as last_analyze_name,
                    alo.created_at::integer as last_analyze_created_at
             from analyzers as an
                      left join analyzers_logs as alo
                                on an.last_analyze_id = alo.id,
                  engines as e,
                  algorithms as al
             where an.engine_id = e.id
               and an.algorithm_id = al.id
             order by an.id
                 limit $1
             offset $2`,
            [limit, offset]
        );

        // TODO smart group
        const analyzers = rawAnalyzers.map(
            ({
                 engine_name,
                 algorithm_algorithm, algorithm_name,
                 last_analyze_name, last_analyze_created_at,
                 ...rest
             }) => ({
                ...rest,
                engine: {
                    name: engine_name,
                },
                algorithm: {
                    algorithm: algorithm_algorithm,
                    name: algorithm_name,
                },
                lastAnalyze: {
                    name: last_analyze_name,
                    created_at: last_analyze_created_at,
                },
            })
        );

        return analyzers;
    }

    // TODO to model
    async getById(id: number): Promise<Record<string, any> | null> {
        const {rows: [rawAnalyzer]} = await this.client.query<{
            id: number,
            type: string,
            name: string,
            threshold: number,
            code: string,
            is_using: boolean,
            created_at: number,
            updated_at: number,
            engine_id: number,
            engine_name: string,
            algorithm_id: number,
            algorithm_algorithm: string,
            algorithm_name: string,
            creator_id: number,
            creator_name: string,
            creator_role_name: string,
            last_analyze_name: string,
            last_analyze_value: number,
            last_analyze_analyzer_state_value: number,
            last_analyze_created_at: number,
        }>(
            `select an.id::integer, an.name, an.type,
                    an.threshold,
                    an.code,
                    an.is_using,
                    an.created_at::integer, an.updated_at::integer, e.id::integer as engine_id, e.name as engine_name,
                    al.id::integer as algorithm_id, al.algorithm as algorithm_algorithm,
                    al.name                  as algorithm_name,
                    u.id::integer as creator_id, u.name as creator_name,
                    r.name                   as creator_role_name,
                    alo.analyzer_state_name  as last_analyze_name,
                    alo.value                as last_analyze_value,
                    alo.analyzer_state_value as last_analyze_analyzer_state_value,
                    alo.created_at::integer as last_analyze_created_at
             from analyzers as an
                      left join analyzers_logs as alo
                                on an.last_analyze_id = alo.id,
                  engines as e,
                  algorithms as al,
                  users as u,
                  roles as r
             where an.id = $1
               and an.engine_id = e.id
               and an.algorithm_id = al.id
               and an.creator_id = u.id
               and u.role_id = r.id limit 1`,
            [id]
        );

        if (!rawAnalyzer) {
            return null;
        }

        const {rows: rawStates} = await this.client.query<{
            id: number,
            name: string,
            value: number,
        }>(
            `select id::integer, name, value
             from analyzers_states
             where analyzer_id = $1
             order by id desc`,
            [id]
        );

        // TODO smart group
        const states = rawStates.map(({value, ...rest}) => ({
            ...rest,
            value: Number(value),
        }));

        // TODO smart group
        const {
            engine_id, engine_name,
            algorithm_id, algorithm_algorithm, algorithm_name,
            creator_id, creator_name, creator_role_name,
            last_analyze_name, last_analyze_value, last_analyze_analyzer_state_value, last_analyze_created_at,
            ...rest
        } = rawAnalyzer;

        const analyzer = {
            ...rest,
            engine: {
                id: engine_id,
                name: engine_name,
            },
            algorithm: {
                id: algorithm_id,
                algorithm: algorithm_algorithm,
                name: algorithm_name,
            },
            creator: {
                id: creator_id,
                name: creator_name,
                role: {
                    name: creator_role_name,
                },
            },
            states,
            lastAnalyze: {
                name: last_analyze_name,
                value: Number(last_analyze_value),
                analyzer_state_value: Number(last_analyze_analyzer_state_value),
                created_at: last_analyze_created_at,
            },
        };

        return analyzer;
    }

    // TODO to model
    async getForAnalyze(code: string): Promise<Record<string, any> | null> {
        const {rows: [rawAnalyzer]} = await this.client.query<{
            id: number,
            type: string,
            name: string,
            threshold: number,
            engine_name: string,
            algorithm: string,
            algorithm_name: string,
            algorithm_params: Record<string, any>,
        }>(
            `select an.id::integer, an.name, an.type,
                    an.threshold,
                    e.name    as engine_name,
                    al.algorithm,
                    al.name   as algorithm_name,
                    al.params as algorithm_params
             from analyzers as an,
                  engines as e,
                  algorithms as al
             where an.code = $1
               and an.is_using
               and an.engine_id = e.id
               and an.algorithm_id = al.id limit 1`,
            [code]
        );

        if (!rawAnalyzer) {
            return null;
        }

        const {rows: rawStates} = await this.client.query<{
            id: number,
            name: string,
            value: number,
        }>(
            `select id::integer, name, value
             from analyzers_states
             where analyzer_id = $1
             order by id desc`,
            [rawAnalyzer.id]
        );

        // TODO smart group
        const states = rawStates.map(({value, ...rest}) => ({
            ...rest,
            value: Number(value),
        }));

        // TODO smart group
        const analyzer = {
            ...rawAnalyzer,
            states,
        };

        return analyzer;
    }

    async getThresholdByCode(code: string): Promise<null | number> {
        const {rows: [analyzer]} = await this.client.query<{
            threshold: number,
        }>(
            `select threshold
             from analyzers
             where code = $1
               and is_using limit 1`,
            [code]
        );

        if (!analyzer) {
            return null;
        }

        return analyzer.threshold;
    }

    async update(
        id: number,
        engineId: number,
        algorithmId: number,
        type: string,
        name: string,
        threshold: number,
        code: string,
        isUsing: boolean,
    ): Promise<void> {
        await this.client.query(
            `update analyzers
             set engine_id    = $1,
                 algorithm_id = $2,
                 type         = $3,
                 name         = $4,
                 threshold    = $5,
                 code         = $6,
                 is_using     = $7,
                 updated_at   = extract(epoch from now())
             where id = $8`,
            [engineId, algorithmId, type, name, threshold, code, isUsing, id]
        );
    }

    async activate(id: number, isUsing: boolean): Promise<void> {
        await this.client.query(
            `update analyzers
             set is_using = $1
             where id = $2`,
            [isUsing, id]
        );
    }

    async delete(id: number): Promise<null | number> {
        try {
            await this.client.query(
                `delete
                 from analyzers
                 where id = $1`,
                [id]
            );

            return null;
        } catch (e: any) {
            if (e.code === '23503') {
                return 1;
            }

            throw e;
        }
    }
}

export {analyzersRepository};
