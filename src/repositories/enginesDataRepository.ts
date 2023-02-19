import {Repository} from './Repository';

export const enginesDataRepository = new class EnginesDataRepository extends Repository {
    async createOne(model: Record<string, any>): Promise<number> {
        const {fields, aliases, values} = Object
            .entries(model)
            .reduce<{
                fields: string[],
                aliases: string[],
                values: any[],
            }>((res, [key, value]) => {
                res.fields.push(key);
                res.values.push(value);
                res.aliases.push(`$${res.values.length}`);

                return res;
            }, {
                fields: [],
                aliases: [],
                values: [],
            });

        const fieldsString = fields.join(',');
        const aliasesString = aliases.join(',');

        const {rows: [{id}]} = await this.client.query(
            `insert into engines_data(${fieldsString})
            values (${aliasesString})
            returning id::integer`,
            values
        );

        return id;
    }
}
