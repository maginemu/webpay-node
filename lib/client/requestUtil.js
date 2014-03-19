var _ = require('lodash');

var error = require('../error');

function isRetrievedObject(obj) {
	return _.has(obj, 'id');
}

function toId(charge) {
	if (_.isString(charge)) {
		return charge;
	} else if (isRetrievedObject(charge)) {
		return charge.id;
	} else {
		return '';
	}
}

module.exports = function(client) {

	/**
	 * normalize optional params and callback and set to options
	 * @param options Base object
	 * @param params Optional params, possibly a function
	 * @param callback Callback function or null
	 */
	function normalizeOptionalParams(options, params, callback) {
		if (typeof params === 'function') {
			options.callback = params;
		} else {
			options.data = params;
			options.callback = callback;
		}
	}

	/**
	 * call member taking care of empty ID
	 * @param {Object} options
	 * @param {String} pathTemplate
	 * @param {Object|String} object
	 */
	function callMemberApi(options, pathTemplate, object) {
		var id = toId(object);
		if (!id) {
			return options.callback(error.invalidIdError());
		} else {
			options.path = pathTemplate.replace(':id', id);
			return client._execute(options);
		}
	}

	function wrapDeleteCallback(callback) {
		if (!callback) {
			return null;
		}
		return function (err, res) {
			if (err) {
				return callback(err);
			}
			return callback(null, res.deleted);
		};
	}

	return {
		normalizeOptionalParams: normalizeOptionalParams,
		callMemberApi: callMemberApi,
		wrapDeleteCallback: wrapDeleteCallback
	};
};
