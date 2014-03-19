'use strict';

module.exports = function event(client) {

  var util = require('./requestUtil')(client);

  return {

    /**
     * @param {Object|String} target ID or object
     * @param {Function} callback
     */
    retrieve: function retrieve(target, callback) {
      util.callMemberApi({method: 'get', callback: callback}, '/events/:id', target);
    },

    /**
     * @param {Object} params
     * @param {Function} callback
     */
    all: function all(params, callback) {
      return client._execute({method: 'get', path: '/events', query: params, callback: callback});
    }
  };
};
