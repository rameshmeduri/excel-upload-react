import express from 'express';
import createBulk from './campaign.controller';

const router = express.Router();

router.post('/campaigns', createBulk);

module.exports = router;
