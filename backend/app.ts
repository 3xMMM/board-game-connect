import express, { NextFunction, Request, Response } from 'express';
import pool from './utils/pool';
import session from 'express-session';
import createSessionStore from 'connect-pg-simple';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT ?? 4000;

// Add values to Express Session's SessionData
declare module 'express-session' {
    interface SessionData {
        userId: number | null
        username: string
    }
}

const SessionStore = createSessionStore(session);

app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}));

app.use(
    session({
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
    })
);

app.use(express.json());

// Default Response content type will be JSON. Override if needed in controllers.
app.use((request, response, next) => {
    response.contentType('application/json');
    next();
});

function isAuthenticated (req: Request, res: Response, next: NextFunction): void {
    if (req.session.userId) next();
    else next('route');
}

app.get('/', isAuthenticated, (req, res) => {
    res.send('Logged in');
});

app.get('/', (req, res) => {
    res.send('You need to log in');
});

app.use('/api', routes);

// app.get('/api/admin/authentication/session-check', (request, response, next) => {
//     const sessionIsValid = request.session.userId !== null;
//     response.contentType('application/json');
//     response.status(200).send({
//         sessionIsValid,
//         // TODO Need to send the logged in user from here. Re-use the getter in the login
//     });
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
