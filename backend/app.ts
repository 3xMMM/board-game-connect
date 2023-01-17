import express, { Request, Response } from 'express';
// import * as dotenv from 'dotenv';
import { Client } from 'pg';

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

console.log(process.env);

void client.connect().then(() => {
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
