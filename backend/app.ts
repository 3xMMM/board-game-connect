import express, { Request, Response } from 'express';
// import * as dotenv from 'dotenv';
import { Client } from 'pg';
import session from 'express-session';

// dotenv.config();

const app = express();
const port = process.env.PORT ?? 4000;
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? '5432')
});

// app.use(
//   session({
//
//   })
// );

void client.connect().then(() => {
  // eslint-disable-next-line n/handle-callback-err
  client.query('SELECT NOW()', (err, res) => {
    console.log(res.rows);
    void client.end();
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Home Route');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, http://localhost:${port}`);
});
