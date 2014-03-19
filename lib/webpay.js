'use strict';

var Client = require('./client');

var apiBase = 'https://api.webpay.jp';
var apiVersion = '/v1';
var apiKey = null;

var client = null;

var webpay = {
  get client() {
    if (!client) {
      client = new Client(apiKey, apiBase, apiVersion);
    }
    return client;
  },

  get apiBase() {
    return apiBase;
  },

  set apiBase(val) {
    apiBase = val;
    client = null;
  },

  /**
   * get current apiVersion
   * @return {string} apiVersion
   */
  get apiVersion() {
    return apiVersion;
  },

  /**
   * set apiVersion
   * @param {string} val
   */
  set apiVersion(val) {
    apiVersion = val;
    client = null;
  },

  /**
   * get current apiKey
   * @return {string} apiKey
   */
  get apiKey() {
    return apiKey;
  },

  /**
   * set apiKey
   * @param {string} val
   */
  set apiKey(val) {
    apiKey = val;
    client = null;
  }
};


module.exports = webpay;
