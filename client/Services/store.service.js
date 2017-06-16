/* eslint-disable arrow-body-style */
import axios from 'axios';

export const getCampaigns = () => {
  return axios.get('/api/v1/campaigns');
};

export const postCampaigns = (obj) => {
  return axios.post('/api/v1/campaigns', obj);
};
