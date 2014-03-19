'use strict';

module.exports = function token(client) {

  var util = require('./requestUtil')(client);

  return {
    /**
     * @param {Object} params See API document in webpay.jp for detail
     * @param {Function} callback
     */
    create: function create(params, callback) {
      return client._execute({method: 'post', path: '/tokens', data: params, callback: callback});
    },

    /**
     * @param {Object|String} target ID or object
     * @param {Function} callback
     */
    retrieve: function retrieve(target, callback) {
      util.callMemberApi({method: 'get', callback: callback}, '/tokens/:id', target);
    }
  };
};
