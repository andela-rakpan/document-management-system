/* eslint-disable no-console*/

import express from 'express';
import logger from 'morgan';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import http from 'http';
import open from 'open';
import path from 'path';
import config from '../webpack.config.dev';
import routes from '../server/routes';


const app = express();
const compiler = webpack(config);
const router = express.Router();
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use router for our routes
routes(router);
app.use('/api', router);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const server = http.createServer(app);
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`The server is running at localhost:${port}`);
    open(`http://localhost:${port}`);
  }
});

export default app;
