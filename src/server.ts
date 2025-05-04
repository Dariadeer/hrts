import express, { Application } from 'express';
import path from 'path';

const app: Application = express();
const port: number = parseInt(process.env.PORT || '3000');

app.use(express.static(path.resolve(import.meta.dirname, './client')));

app.listen(port, () => console.log('Listening on http://localhost:' + port))
app.listen(port, 'http://192.168.1.238', () => console.log('Listening on http://192.168.1.238:' + port))
