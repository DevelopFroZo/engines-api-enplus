import type {Handler, NextFunction} from 'express';
import type {Request, Response} from '@/types';

function safeEndpointDecorator(handler: Handler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            const {method, originalUrl, params, query, body} = req;

            console.error(`[ERROR] ${method} ${originalUrl}`);

            if (Object.keys(params).length > 0) {
                console.error(`  [PARAMS]:`);
                console.error(`  ${JSON.stringify(params, null, 2).replace(/\n/g, '\n  ')}`);
            }

            if (Object.keys(query).length > 0) {
                console.error(`  [QUERY]:`);
                console.error(`  ${JSON.stringify(query, null, 2).replace(/\n/g, '\n  ')}`);
            }

            if (Object.keys(body).length > 0) {
                console.error(`  [BODY]:`);
                console.error(`  ${JSON.stringify(body, null, 2).replace(/\n/g, '\n  ')}`);
            }

            console.error('\n', error, '\n');

            res.status(500).json({
                error: {
                    message: 'Internal Server Error',
                },
            });
        }
    };
}

export {safeEndpointDecorator};
