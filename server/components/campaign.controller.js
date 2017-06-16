import config from './config';
import MongoStore from './campaign.mongodb.store';
import logger from './logger.service';

const store = MongoStore.getInstance(config);

const Message = {
  RESPONSE_MESSAGE: {},
  BAD_REQUEST: {
    message: 'Bad Request',
    status: 400,
  },
  NOT_FOUND: {
    message: 'Not Found',
    status: 404,
  },
};

const createBulk = (req, res, next) => {
  const data = req.body;
  if (Object.keys(data).length === 0) {
    logger.error('POST /campaign error - empty data');
    res.status(Message.BAD_REQUEST.status).json(Message.BAD_REQUEST);
    return;
  }

  store.create(data)
    .then((result) => {
      logger.info('POST /campaign success', result);
      res.json(result);
    })
    .catch((err) => {
      logger.error('POST /campaign server error', err);
      res.sendStatus(500);
    });
};

export default createBulk;
