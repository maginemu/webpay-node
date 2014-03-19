var request = require('superagent');
var _ = require('lodash');

var error = require('../error');

var VERSION = 'test';

var WebPayClient = function(api_key, api_base, api_version) {
	var self = this;

	self.api_key = api_key;
	self.api_base = api_base;
	self.api_version = api_version;

	self.defaultHeaders = {
		'Authorization': 'Bearer ' + api_key,
		'User-Agent': 'WebPay' + api_version + ' JavascriptBinding/' + VERSION
	};

	self.account = require('./account')(self);
	self.charge = require('./charge')(self);
	self.customer = require('./customer')(self);
	self.event = require('./event')(self);
};

WebPayClient.prototype = {
	_basePath: function() {
		var self = this;
		return self.api_base + self.api_version;
	},

	_execute: function(params) {
		var callback = params.callback || function() {};

		var req = request[params.method](this._basePath() + params.path);
		req.set(this.defaultHeaders);

		if (params.query) {
			req.query(params.query);
		}

		if (params.header) {
			req.set(params.header);
		}

		if (params.data) {
			req.send(params.data);
		}

		req.end(function(err, res) {
			if (err) {
				return callback(new error.ApiConnectionError(null, err));
			} else if (200 <= res.status && res.status < 300) {
				return callback(null, res.body);
			} else {
				return callback(error.fromJsonResponse(res.status, res.body));
			}
		});
	}
};


module.exports = WebPayClient;
