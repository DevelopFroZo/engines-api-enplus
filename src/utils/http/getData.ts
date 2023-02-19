import type {Request} from '@/types';

function getData(req: Request, keys: string[] = []): Record<string, any> {
    let data: Record<string, any>;

    if ('body' in req && Object.keys(req.body).length > 0) {
        data = req.body;
    } else {
        // @ts-ignore
        data = req.query;
    }

    if (keys.length === 0) {
        return data;
    }

    const keysSet = new Set(keys);

    return Object
        .entries(data)
        .reduce<Record<string, any>>((res, [key, value]) => {
            if (keysSet.has(key)) {
                res[key] = value;
            }

            return res;
        }, {});
}

export {getData};
