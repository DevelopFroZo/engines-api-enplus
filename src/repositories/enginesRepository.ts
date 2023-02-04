import {Repository} from './Repository';

const enginesRepository = new class EnginesRepository extends Repository {
    async create(creatorId: number, name: string): Promise<number> {
        const {rows: [{id}]} = await this.client.query<{
            id: number
        }>(
            `insert into engines(creator_id, name)
             values ($1, $2) returning id::integer`,
            [creatorId, name]
        );

        return id;
    }

    // TODO to model
    async getList(limit: number, offset: number): Promise<Record<string, any>> {
        const {rows: rawEngines} = await this.client.query<{
            id: number,
            name: string,
            created_at: number,
            creator_name: string,
        }>(
            `select e.id::integer, e.name,
                    e.created_at::integer, u.name as creator_name
             from engines as e,
                  users as u
             where e.creator_id = u.id
             order by e.id
                 limit $1
             offset $2`,
            [limit, offset]
        );

        // TODO smart group
        const engine = rawEngines.map(({creator_name, ...rest}) => ({
            ...rest,
            creator: {
                name: creator_name,
            },
        }));

        return engine;
    }

    // TODO to model
    async getById(id: number): Promise<Record<string, any> | null> {
        const {rows: [rawEngine]} = await this.client.query<{
            id: number,
            name: string,
            created_at: number,
            updated_at: number,
            creator_id: number,
            creator_name: string,
            creator_email: string,
            creator_role_name: string,
        }>(
            `select e.id::integer, e.name,
                    e.created_at::integer, e.updated_at::integer, u.id::integer as creator_id, u.name as creator_name,
                    u.email as creator_email,
                    r.name  as creator_role_name
             from engines as e,
                  users as u,
                  roles as r
             where e.id = $1
               and e.creator_id = u.id
               and u.role_id = r.id limit 1`,
            [id]
        );

        if (!rawEngine) {
            return null;
        }

        // TODO smart group
        const {creator_id, creator_name, creator_email, creator_role_name, ...rest} = rawEngine;

        const engine = {
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

        return engine;
    }

    async update(id: number, name: string): Promise<void> {
        await this.client.query(
            `update engines
             set name       = $1,
                 updated_at = extract(epoch from now())
             where id = $2`,
            [name, id]
        );
    }

    async delete(id: number): Promise<null | number> {
        try {
            await this.client.query(
                `delete
                 from engines
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

export {enginesRepository};
