import express, { NextFunction, Request, Response } from 'express';
// import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import session from 'express-session';
import createSessionStore from 'connect-pg-simple';
import bcrypt from 'bcrypt';

// Add values to Express Session's SessionData
declare module 'express-session' {
  interface SessionData {
    userId: boolean
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

app.get('/login', express.urlencoded({ extended: false }), (req, res, next) => {
  // login logic to validate req.body.user and req.body.pass
  // would be implemented here. for this example any combo works

  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err);

    // store user information in session, typically a user id
    req.session.userId = true;

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) { next(err); return; }
      res.redirect('/');
    });
  });
});

app.get('/logout', (req, res, next) => {
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged-in user
  req.session.userId = false;
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
