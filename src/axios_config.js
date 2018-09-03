"use strict"

const axios     = require('axios');
const apiConfig = require('./api_config.js');

const AxiosInstance = axios.create({
  baseURL: apiConfig.api_domain
});

module.exports = AxiosInstance;
