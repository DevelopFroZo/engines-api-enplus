import {Repository} from './Repository';

const algorithmsRepository = new class AlgorithmsRepository extends Repository {
    async create(creatorId: number, algorithm: string, name: string, params: Record<string, any>): Promise<number> {
        const {rows: [{id}]} = await this.client.query<{
            id: number,
        }>(
            `insert into algorithms(creator_id, algorithm, name, params)
             values ($1, $2, $3, $4) returning id::integer`,
            [creatorId, algorithm, name, params]
        );

        return id;
    }

    // TODO to model
    async getList(limit: number, offset: number): Promise<Record<string, any>> {
        const {rows: rawAlgorithms} = await this.client.query<{
            id: number,
            algorithm: string,
            name: string,
            created_at: number,
            creator_name: string,
        }>(
            `select a.id::integer, a.algorithm,
                    a.name,
                    a.created_at::integer, u.name as creator_name
             from algorithms as a,
                  users as u
             where a.creator_id = u.id
             order by a.id
                 limit $1
             offset $2`,
            [limit, offset]
        );

        // TODO smart group
        const algorithms = rawAlgorithms.map(({creator_name, ...rest}) => ({
            ...rest,
            creator: {
                name: creator_name,
            },
        }));

        return algorithms;
    }

    // TODO to model
    async getById(id: number): Promise<Record<string, any> | null> {
        const {rows: [rawAlgorithm]} = await this.client.query<{
            id: number,
            algorithm: string,
            name: string,
            params: Record<string, any>,
            created_at: number,
            updated_at: number,
            creator_id: number,
            creator_name: string,
            creator_email: string,
            creator_role_name: string,
        }>(
            `select a.id::integer, a.algorithm,
                    a.name,
                    a.params,
                    a.created_at::integer, a.updated_at::integer, u.id::integer as creator_id, u.name as creator_name,
                    u.email as creator_email,
                    r.name  as creator_role_name
             from algorithms as a,
                  users as u,
                  roles as r
             where a.id = $1
               and a.creator_id = u.id
               and u.role_id = r.id limit 1`,
            [id]
        );

        if (!rawAlgorithm) {
            return null;
        }

        // TODO smart group
        const {creator_id, creator_name, creator_email, creator_role_name, ...rest} = rawAlgorithm;

        const algorithm = {
            ...rest,
            creator: {
                id: creator_id,
                name: creator_name,
                email: creator_email,
                role: {
                    name: creator_role_name,
                },
            },
        };

        return algorithm;
    }

    async update(id: number, algorithm: string, name: string, params: Record<string, any>): Promise<void> {
        await this.client.query(
            `update algorithms
             set algorithm  = $1,
                 name       = $2,
                 params     = $3,
                 updated_at = extract(epoch from now())
             where id = $4`,
            [algorithm, name, params, id]
        );
    }

    async delete(id: number): Promise<null | number> {
        try {
            await this.client.query(
                `delete
                 from algorithms
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

export {algorithmsRepository};
