/* global module: true */

var requestUtil = require('./requestUtil');

module.exports = function(client) {

	var util = requestUtil(client);

	return {

		/**
		 * @param {Object|String} target ID or object
		 * @param {Function} callback
		 */
		retrieve: function(target, callback) {
			util.callMemberApi({method: 'get', callback: callback}, '/events/:id', target);
		},

		/**
		 * @param {Object} params
		 * @param {Function} callback
		 */
		all: function(params, callback) {
			return client._execute({method: 'get', path: '/events', query: params, callback: callback});
		}
	};
};
