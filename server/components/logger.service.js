//import winston from 'winston';
let winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
  ],
});

logger.info('Logger initialized');

//export default logger;
module.exports = logger;
