/*global module: true */

var account = function(client) {
	var util = require('./requestUtil')(client);

	return {

		retrieve: function (callback) {
			return client._execute({method: 'get', path: '/account', callback: callback});
		},

		deleteData: function (callback) {
			return client._execute({method: 'del', path: '/account/data', callback: util.wrapDeleteCallback(callback)});
		}
	};
};

module.exports = account;
