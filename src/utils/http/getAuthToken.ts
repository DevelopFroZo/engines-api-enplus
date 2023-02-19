import type {Request} from '@/types';

type Token = string | null;

function tryExportFromHeaders(req: Request): Token {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return null;
    }

    const token = authorizationHeader.split(' ')[1];

    return token ?? null;
}

function tryExportFromBody(req: Request): Token {
    return req.body?.access_token ?? null;
}

function tryExportFromQuery(req: Request): Token {
    const token = req.query.access_token;

    if (typeof token !== 'string') {
        return null;
    }

    return token;
}

function getAuthToken(req: Request): Token {
    return tryExportFromHeaders(req) ?? tryExportFromBody(req) ?? tryExportFromQuery(req);
}

export {getAuthToken};
