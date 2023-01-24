import express, { NextFunction, Request, Response } from 'express';
// import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import session from 'express-session';
import createSessionStore from 'connect-pg-simple';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { AdminUser } from './api';

// Add values to Express Session's SessionData
declare module 'express-session' {
    interface SessionData {
        userId: number | null
        username: string
    }
}

const SessionStore = createSessionStore(session);

// dotenv.config();

const app = express();
const port = process.env.PORT ?? 4000;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT ?? '5432'),
});

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

app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}));

// TODO A test. Will remove later
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(res.rows);
});

function isAuthenticated (req: Request, res: Response, next: NextFunction): void {
    if (req.session.userId) next();
    else next('route');
}

// void client.connect().then(() => {
//   // eslint-disable-next-line n/handle-callback-err
//   client.query('SELECT NOW()', (err, res) => {
//     console.log(res.rows);
//     void client.end();
//   });
// });

app.get('/', isAuthenticated, (req, res) => {
    res.send('Logged in');
});

app.get('/', (req, res) => {
    res.send('You need to log in');
});

interface LoginRequest {
    username: string
    password: string
}

app.post('/api/admin/login', express.urlencoded({ extended: false }), (request, response, next) => {
    const requestBody: LoginRequest = request.body;
    console.log(requestBody);
    response.contentType('application/json');
    const query = {
        text: 'SELECT * FROM admin_users WHERE username = $1',
        values: [requestBody.username],
    };

    pool.query(query).then(async queryResults => {
        const firstRow: AdminUser = queryResults.rows[0];
        const passwordMatch = await bcrypt.compare(requestBody.password, firstRow.password);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        if (passwordMatch) {
            request.session.regenerate(function (err) {
                if (err) next(err);

                // store user information in session, typically a user id
                request.session.userId = firstRow.id;
                request.session.username = firstRow.username;

                void pool.query('UPDATE admin_users SET last_login = current_timestamp WHERE id = $1', [firstRow.id]);

                // save the session before redirection to ensure page
                // load does not happen before session is saved
                request.session.save(function (err) {
                    if (err) {
                        next(err);
                        return;
                    }
                    response.status(200).send({
                        id: firstRow.id,
                        first_name: firstRow.first_name,
                        last_name: firstRow.last_name,
                        username: firstRow.username,
                        email: firstRow.email,
                        last_login: firstRow.last_login,
                    });
                });
            });
        } else {
            // May want to log this
            response.status(400).send('Could not login. Please try again.');
        }
    }).catch(e => {
        console.error(e);
        response.status(500).send('Server Error');
    });
});

app.get('/logout', (req, res, next) => {
    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged-in user
    req.session.userId = null;
    req.session.username = '';
    req.session.save((err) => {
        if (err) next(err);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
            if (err) next(err);
            res.redirect('/');
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
