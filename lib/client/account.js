'use strict';

module.exports = function account(client) {
  var util = require('./requestUtil')(client);

  return {

    retrieve: function retrieve(callback) {
      return client._execute({method: 'get', path: '/account', callback: callback});
    },

    deleteData: function deleteData(callback) {
      return client._execute({method: 'del', path: '/account/data', callback: util.wrapDeleteCallback(callback)});
    }
  };
};
