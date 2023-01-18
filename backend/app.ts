import express, { Request, Response } from 'express';
// import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import session from 'express-session';
import createSessionStore from 'connect-pg-simple';

const SessionStore = createSessionStore(session);

// dotenv.config();

const app = express();
const port = process.env.PORT ?? 4000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? '5432')
});

app.use(
  session({
    store: new SessionStore({
      pool
    }),
    secret: 'hey',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    // Insert express-session options here
  })
);

pool.query('SELECT NOW()', (err, res) => {
  if (typeof err !== 'undefined') {
    console.error(err);
    return;
  }
  console.log(res.rows);
});

// void client.connect().then(() => {
//   // eslint-disable-next-line n/handle-callback-err
//   client.query('SELECT NOW()', (err, res) => {
//     console.log(res.rows);
//     void client.end();
//   });
// });

app.get('/', (req: Request, res: Response) => {
  res.send('Home Route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, http://localhost:${port}`);
});
