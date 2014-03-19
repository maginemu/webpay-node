'use strict';

var request = require('superagent');
var _ = require('lodash');

var error = require('../error');

var VERSION = '0.1.0';

var WebPayClient = function(apiKey, apiBase, apiVersion, language) {
  var self = this;

  self.apiKey = apiKey;
  self.apiBase = apiBase;
  self.apiVersion = apiVersion;

  self.defaultHeaders = {
    'Authorization': 'Bearer ' + apiKey,
    'User-Agent': 'WebPay' + apiVersion + ' JavascriptBinding/' + VERSION,
    'Accept-Language': language
  };

  self.account = require('./account')(self);
  self.charge = require('./charge')(self);
  self.customer = require('./customer')(self);
  self.event = require('./event')(self);
  self.token = require('./token')(self);
};

WebPayClient.prototype = {
  _basePath: function() {
    var self = this;
    return self.apiBase + self.apiVersion;
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
      } else if (_.isEmpty(res.body)) {
        // JSON parse error
        return callback(new error.ApiConnectionError('Response JSON is broken'));
      } else if (200 <= res.status && res.status < 300) {
        return callback(null, res.body);
      } else {
        return callback(error.fromJsonResponse(res.status, res.body));
      }
    });
  }
};


module.exports = WebPayClient;
