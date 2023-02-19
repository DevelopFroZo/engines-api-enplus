import {enginesDataRepository} from '@/repositories/enginesDataRepository';

type CreateOneResult = Promise<[null, number] | [number, null]>;

export const enginesDataService = new class EnginesDataService {
    async createOne(model: Record<string, any>): CreateOneResult {
        if (!('engine_id' in model) && !('anchor' in model)) {
            return [1, null];
        }

        const id = await enginesDataRepository.createOne(model);

        return [null, id];
    }
}
