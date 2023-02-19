import type {NextFunction, RequestHandler} from 'express';
import type {Request, Response} from '@/types';

function allowedMethods(...methods: string[]): RequestHandler {
    const methodsSet = new Set(methods.map(method => method.toLowerCase()));

    return (req: Request, res: Response, next: NextFunction): void => {
        const method = req.method.toLowerCase();

        if (methodsSet.size !== 0 && !methodsSet.has(method)) {
            res.sendStatus(405);

            return;
        }

        next();
    };
}

export {allowedMethods};
