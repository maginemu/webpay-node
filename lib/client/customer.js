'use strict';

module.exports = function customer(client) {

  var util = require('./requestUtil')(client);

  return {
    /**
     * @param {Object} params See API document in webpay.jp for detail
     * @param {Function} callback
     */
    create: function create(params, callback) {
      return client._execute({method: 'post', path: '/customers', data: params, callback: callback});
    },

    /**
     * @param {Object|String} target ID or object
     * @param {Function} callback
     */
    retrieve: function retrieve(target, callback) {
      util.callMemberApi({method: 'get', callback: callback}, '/customers/:id', target);
    },

    /**
     * @param {Object} params
     * @param {Function} callback
     */
    all: function all(params, callback) {
      return client._execute({method: 'get', path: '/customers', query: params, callback: callback});
    },

    /**
     * @param {Object|String} target Id or object
     * @param {Object} params Can omit
     * @param {Function} callback
     */
    update: function update(target, params, callback) {
      var options = {method: 'post'};
      util.normalizeOptionalParams(options, params, callback);
      util.callMemberApi(options, '/customers/:id', target);
    },

    /**
     * Delete the specified customer. Not to use JS reserved word, this method is named destroy, not delete.
     * Callback value is 'true' if API call is succeeded.
     * @param {Object|String} target Id or object
     * @param {Function} callback
     */
    destroy: function destroy(target, callback) {
      var options = {method: 'del', callback: util.wrapDeleteCallback(callback)};
      util.callMemberApi(options, '/customers/:id', target);
    }
  };
};
