import * as request from 'request';
import * as express from 'express';
import * as cors from 'cors';

const app = express();

app.use(cors({ credentials: true, origin: true }));

app.all('/api/sync/*', async function (req, res) {
  const url = 'http://localhost:5984' + req.url.replace('/api/sync', '');
  req.pipe(request(url)).pipe(res);
});

const port = process.env.port || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
