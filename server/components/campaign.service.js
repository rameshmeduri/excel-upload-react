//import CampaignMongodbStore from './campaign.mongodb.store';
let CampaignMongodbStore = require('./campaign.mongodb.store');

const STATUS = {
  NEW: 'NEW',
  PAYMENT_STARTED: 'PAYMENT_STARTED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAID: 'PAID',
  ISSUANCE_STARTED: 'ISSUANCE_STARTED',
  ISSUANCE_FAILED: 'ISSUANCE_FAILED',
  ISSUANCE_PENDING: 'ISSUANCE_PENDING',
  ISSUED: 'ISSUED',
  REFERRED: 'REFERRED',
};

const ERROR = {
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  INVALID_STATUS: 'INVALID_STATUS',
  PAYMENT_ALREADY_STARTED: 'PAYMENT_ALREADY_STARTED',
  PAYMENT_ALREADY_DONE: 'PAYMENT_ALREADY_DONE',
  ORDER_NOT_PAID: 'ORDER_NOT_PAID',
  ISSUANCE_ALREADY_STARTED: 'ISSUANCE_ALREADY_STARTED',
  ISSUANCE_ALREADY_DONE: 'ISSUANCE_ALREADY_DONE',
};

class CampaignService {

  static get STATUS() {
    return STATUS;
  }

  static get ERROR() {
    return ERROR;
  }

  constructor(options) {
    const defaultOptions = {};
    const customOptions = options || {};
    if (options.dbConfig) {

      const mongodbStore = CampaignMongodbStore.getInstance(options.dbConfig);
      console.log('================================');
      console.log(mongodbStore);
      console.log('================================');
      customOptions.store = mongodbStore;
    }
    Object.assign(this, defaultOptions, customOptions);
  }

  /**
   * Campaign
   * Place an campaign
   * @returns {referenceNumber}
   */
  save(data) {
    console.log('===========save(data) {=============');
    return this.store.create(data).then((result) => {
      return result;
    });
  }

  /**
   * Get Campaign
   * @returns {campaign}
   */
  getCampaign(referenceNumber) {
    return this.store.get(referenceNumber);
  }

  /**
   * Update Campaign
   * @returns {referenceNumber}
   */
  update(updatedCampaign) {
    const { referenceNumber } = updatedCampaign;
    return this.getCampaign(referenceNumber).then((campaign) => {
      if (!campaign) {
        throw new Error(ERROR.ORDER_NOT_FOUND);
      }

      // on update, ensure that we retain referenceNumber and status
      const status = campaign.status;
      Object.assign(updatedCampaign, { referenceNumber, status });
      return this.store.update(referenceNumber, updatedCampaign)
        .then(result => result);
    });
  }

  /**
   * Update Campaign
   * @returns {referenceNumber}
   */
  updateCampaign(referenceNumber, updatedCampaign) {
    const allowedStatuses = [STATUS.NEW, STATUS.PAYMENT_FAILED,
    STATUS.ISSUANCE_PENDING, STATUS.ISSUED,
    STATUS.REFERRED];
    return this.getCampaign(referenceNumber).then((campaign) => {
      if (!campaign) {
        throw new Error(ERROR.ORDER_NOT_FOUND);
      }

      // do not allow update when:
      // - campaign is locked for payment
      // - campaign has already been PAID, i.e. finalized
      if (campaign.status === STATUS.PAYMENT_STARTED) {
        throw new Error(ERROR.PAYMENT_ALREADY_STARTED);
      } else if (campaign.status === STATUS.PAID) {
        throw new Error(ERROR.PAYMENT_ALREADY_DONE);
      } else if (allowedStatuses.indexOf(campaign.status) === -1) {
        throw new Error(ERROR.INVALID_STATUS);
      }

      // on update, ensure that we retain referenceNumber and status
      const status = campaign.status;
      Object.assign(updatedCampaign, { referenceNumber, status });
      return this.store.update(referenceNumber, updatedCampaign)
        .then((result) => {
          const response = { referenceNumber: result.referenceNumber };
          return response;
        });
    });
  }

  /**
   * Get Campaign Status
   * @returns {status}
   */
  getCampaignStatus(referenceNumber) {
    return this.getCampaign(referenceNumber).then((result) => {
      const response = { status: result.status };
      return response;
    });
  }
}

//export default CampaignService;
module.exports = CampaignService;
