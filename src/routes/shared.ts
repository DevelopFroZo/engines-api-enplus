import type {Express} from 'express';

import express from 'express';
import cors from 'cors';

function shared(app: Express) {
    app.use(
        // express.static('static'),
        // helmet(),
        cors({
            origin: true,
            credentials: true,
        }),
        express.json(),
        express.urlencoded({
            extended: true,
        }),
        // session({
        //     cookie: {
        //         httpOnly: true,
        //         maxAge: !dev ? parseInt(process.env.SESSION_COOKIE_MAXAGE) : null,
        //         secure: !dev && process.env.SESSION_COOKIE_SECURE === 'true',
        //         // sameSite: 'none',
        //     },
        //     name: !dev ? process.env.SESSION_NAME : null,
        //     resave: false,
        //     rolling: true,
        //     saveUninitialized: false,
        //     secret: !dev ? process.env.SESSION_SECRET : 'secret',
        //     store: new pgStore({
        //         pool,
        //         tableName: process.env.SESSION_TABLE_NAME,
        //     }),
        // }),
    );
}

export {shared};
