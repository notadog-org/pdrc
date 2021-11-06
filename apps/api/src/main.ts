import * as request from 'request';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const COUCH_DB_HOST = process.env.NX_COUCH_DB_HOST;
const COUCH_DB_USER = process.env.NX_COUCH_DB_USER;
const COUCH_DB_PASSWORD = process.env.NX_COUCH_DB_PASSWORD;
const COUCH_DB_SECURE_HOST = process.env.NX_COUCH_DB_SECURE_HOST;

if (
  [
    COUCH_DB_HOST,
    COUCH_DB_USER,
    COUCH_DB_PASSWORD,
    COUCH_DB_SECURE_HOST,
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

app.post('/api/auth/register', async function (req, res) {
  request
    .put(
      `${COUCH_DB_SECURE_HOST}/_users/org.couchdb.user:${req.body.username}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          name: req.body.username,
          password: req.body.password,
          roles: [],
          type: 'user',
        },
        json: true,
      }
    )
    .pipe(res);
});

app.post('/api/auth/login', async function (req, res) {
  request
    .post(`${COUCH_DB_SECURE_HOST}/_session`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        name: req.body.username,
        password: req.body.password,
      },
      json: true,
    })
    .pipe(res);
});

const port = process.env.port || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
