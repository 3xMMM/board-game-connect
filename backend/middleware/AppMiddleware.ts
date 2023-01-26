import cors from 'cors';
import session from 'express-session';
import pool from '../utils/pool';
import createSessionStore from 'connect-pg-simple';
import { NextFunction, Request, Response } from 'express';

// Add values to Express Session's SessionData
declare module 'express-session' {
    interface SessionData {
        userId: number | null
        username: string
    }
}

const SessionStore = createSessionStore(session);

export const AppMiddleware = {
    useCORS: cors({
        origin: 'http://localhost:3000', // TODO Will need to change this later if deployed
        optionsSuccessStatus: 200,
    }),

    useSession: session({
        store: new SessionStore({
            pool,
            tableName: 'session',
        }),
        secret: 'ABCD1234', // TODO will want this to be an .env or per-build value later
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
            httpOnly: true,
            secure: false, // TODO For localhost this will be false, but prod/remote will be true (requires https)
        },
    }),

    /**
     * Default Response content type will be JSON. Override if needed in controllers.
     */
    contentTypeIsJSONByDefault: (request: Request, response: Response, next: NextFunction) => {
        response.contentType('application/json');
        next();
    },

    requireUserSession: (request: Request, response: Response, next: NextFunction) => {
        if (request.session.userId) next();
        else next('route');
    },
};

export default AppMiddleware;
