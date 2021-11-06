import * as request from 'request';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import {
  COUCH_DB_HOST,
  COUCH_DB_USER,
  COUCH_DB_PASSWORD,
  COUCH_DB_ROOT_HOST,
} from './env';

import { authRouter } from './app/routes';

if (
  [
    COUCH_DB_HOST,
    COUCH_DB_USER,
    COUCH_DB_PASSWORD,
    COUCH_DB_ROOT_HOST,
  ].includes(undefined)
) {
  throw new Error('no database connection');
}

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json({ type: 'application/json' }));

app.all('/api/sync/*', async function (req, res) {
  const url = `${COUCH_DB_HOST}${req.url.replace('/api/sync', '')}`;
  req.pipe(request(url)).pipe(res);
});

app.use(authRouter);

const port = process.env.port || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
