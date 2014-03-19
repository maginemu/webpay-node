'use strict';


module.exports = function charge(client) {
  var util = require('./requestUtil')(client);

  return {
    /**
     * @param {Object} params See API document in webpay.jp for detail
     * @param {Function} callback
     */
    create: function create(params, callback) {
      return client._execute({method: 'post', path: '/charges', data: params, callback: callback});
    },

    /**
     * @param {Object|String} charge Charge ID or object
     * @param {Function} callback
     */
    retrieve: function retrieve(charge, callback) {
      util.callMemberApi({method: 'get', callback: callback}, '/charges/:id', charge);
    },

    /**
     * @param {Object} params
     * @param {Function} callback
     */
    all: function all(params, callback) {
      return client._execute({method: 'get', path: '/charges', query: params, callback: callback});
    },

    /**
     * @param {Object|String} charge Charge ID or object
     * @param {Object|Function} params The optional parameters. You can omit this and specify callback here.
     * @param {Function} callback
     */
    refund: function refund(charge, params, callback) {
      var options = {method: 'post'};
      util.normalizeOptionalParams(options, params, callback);
      util.callMemberApi(options, '/charges/:id/refund', charge);
    },

    /**
     * @param {Object|String} charge Charge ID or object
     * @param {Object|Function} params The optional parameters. You can omit this and specify callback here.
     * @param {Function} callback
     */
    capture: function capture(charge, params, callback) {
      var options = {method: 'post'};
      util.normalizeOptionalParams(options, params, callback);
      util.callMemberApi(options, '/charges/:id/capture', charge);
    }
  };
};
