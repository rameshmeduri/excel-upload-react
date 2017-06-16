/* eslint-disable global-require no-unused-vars */

import 'dotenv/config';
import path from 'path';
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import webpack from 'webpack';
import routes from './components/routes';
import logger from './components/logger.service';



const env = process.env.NODE_ENV;
const app = express();
app.server = http.createServer(app);
let config;
let compiler;


if (env === 'development') {
  config = require('../webpack.config.dev.js');
  compiler = webpack(config);
  app.use(require('connect-history-api-fallback')({ verbose: false }));
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
} else {
  config = require('../webpack.config.prod.js');
  compiler = webpack(config);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

app.use(morgan('tiny', {
  stream: {
    write: message => logger.info(message.trim()),
  },
}));

app.use('/api/v1/', routes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next({
    message: 'Not Found',
    status: 404,
  });
});

logger.info('Environment: ', process.env.NODE_ENV);

app.use((err, req, res, next) => {
  const error = {
    status: err.status || 500,
    message: err.message || 'Server Error',
  };

  res.status(err.status).json(error);
});

app.server.listen(process.env.PORT || 3000);
logger.info(`Started on port ${app.server.address().port}`);
