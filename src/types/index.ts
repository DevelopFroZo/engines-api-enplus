import type * as core from 'express-serve-static-core';

import type {
    Request as ExpressRequest,
    Response as ExpressResponse,
} from 'express';

// import { Session as ExpressSession } from 'express-session';

export enum Roles {
    USER = 'user',
    ADMIN = 'admin',
}

// export interface Session {
//   user_id: number,
//   role: Roles,
//   city_id: number,
//   is_any_city_admin: boolean
// }

export interface ResponseError<T> {
    message: string,
    meta?: T,
    localCode?: number,
}

export type Request<ReqBody = any> = ExpressRequest<core.ParamsDictionary, any, ReqBody, core.Query>

export type Response<T = any, R = any> = ExpressResponse<{
    payload?: T,
    error?: ResponseError<R>,
}>