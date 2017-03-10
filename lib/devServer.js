/* eslint-disable no-console*/

import express from 'express';
import logger from 'morgan';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import http from 'http';
import config from '../webpack.config.dev';
import routes from '../server/routes';


const app = express();
const compiler = webpack(config);
const router = express.Router();
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

// Log requests to the console.
app.use(logger('dev'));

// Allow requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'authorization, Authorization, x-access-token');
  res.header('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE');
  next();
});

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use router for our routes
routes(router);
app.use('/api', router);

// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath
// }));

// app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.status(200).send({
    message: 'Welcome to the Document Management System API'
  });
});

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`The server is running at localhost:${port}`);
});

export default app;
