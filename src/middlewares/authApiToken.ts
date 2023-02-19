import type {NextFunction} from 'express';
import type {Request, Response} from '@/types';

import {getAuthToken} from '@/utils/http/getAuthToken';
// TODO
import {allowedTokens} from '@/utils/allowedTokens';

function authApiToken(req: Request, res: Response, next: NextFunction): void {
    const token = getAuthToken(req);

    // TODO
    if (!token || !allowedTokens.has(token)) {
        res.status(401).json({
            error: {
                message: 'Missing access token',
            },
        });

        return;
    }

    next();
}

export {authApiToken};
