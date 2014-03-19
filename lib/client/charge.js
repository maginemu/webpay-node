/* global module: true */

var _ = require('lodash');
var error = require('../error');

var charge = function(client) {

	var charge = {

		/**
		 * @param {Any} obj
		 * @return {boolean}
		 */
		_isRetrievedObject: function(obj) {
			return _.has(obj, 'id');
		},

		/**
		 * @param {Object|String} charge
		 * @return {String}
		 */
		_toId: function(charge) {
			if (_.isString(charge)) {
				return charge;
			} else if (this._isRetrievedObject(charge)) {
				return charge.id;
			} else {
				return '';
			}
		},


		/**
		 * @param {Object} params
		 * @param {int} params.amount
		 * @param {String} params.currency
		 * @param {String} [params.customer]
		 * @param {Object} [params.card]
		 * @param {String} [params.description=null]
		 * @param {Boolean} [params.capture=true]
		 * @param {String} [params.uuid=null]
		 * @param {Function} callback
		 */
		create: function(params, callback) {
			var path = client._basePath() + '/charges';
			callback = callback || function() {};
			return client._execute('post', path, {data: params}, callback);
		},

		/**
		 * @param {String} chargeId
		 * @param {Function} callback
		 */
		retrieve: function(chargeId, callback) {
			callback = callback || function() {};
			if (!chargeId) {
				return callback(error.invalidIdError());
			}
			var path = client._basePath() + '/charges/' + chargeId;
			return client._execute('get', path, {}, callback);
		},

		/**
		 * @param {Object|String} charge
		 * @param {Object} params
		 * @param {Function} callback
		 */
		refund: function(charge, params, callback) {
			if (typeof params === 'function') {
				callback = params;
				params = {};
			}
			callback = callback || function() {};

			var id = this._toId(charge);
			if (!id) {
				return callback(error.invalidIdError());
			}
			var path = client._basePath() + '/charges/' + id + '/refund';

			var body = {};
			if (!_.isEmpty(params)) {
				body.data = params;
			}
			return client._execute('post', path, body , callback);

		},

		/**
		 * @param {Object} options
		 * @param {Function} callback
		 */
		all: function(options, callback) {
			var path = client._basePath() + '/charges';
			callback = callback || function() {};
			var params = { query: options };
			return client._execute('get', path, params, callback);

		},

		/**
		 * @param {Object|String} charge
		 * @param {Object} params
		 * @param {Function} callback
		 */
		capture: function(charge, params, callback) {
			if (typeof params === 'function') {
				callback = params;
				params = {};
			}
			callback = callback || function() {};
			var id = this._toId(charge);
			if (!id) {
				return callback(error.invalidIdError());
			}
			var path = client._basePath() + '/charges/' + id + '/capture';

			var body = {};
			if (!_.isEmpty(params)) {
				body.data = params;
			}
			return client._execute('post', path, body , callback);
		}
	};
	return charge;
};


module.exports = charge;
