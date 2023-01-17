"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import * as dotenv from 'dotenv';
const pg_1 = require("pg");
// dotenv.config();
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000;
const client = new pg_1.Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : '5432')
});
console.log(process.env);
void client.connect().then(() => {
    client.query('SELECT NOW()', (err, res) => {
        console.log(res.rows);
        void client.end();
    });
});
app.get('/', (req, res) => {
    res.send('Home Route');
});
app.listen(port, () => {
    console.log(`Server running on port ${port}, http://localhost:${port}`);
});
