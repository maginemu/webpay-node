/*global module:true, __dirname:true */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var sinon = require('sinon');

// cache
var mapCache = {};


function stat(filename) {
	try {
		return fs.statSync(filename);
	} catch (e) {
		if (e.code === 'ENOENT') {
			return null;
		} else {
			throw e;
		}
	}
}


/**
 * return if the path is dotfile
 */
function isDotfile(pathStr) {
	return (/^\./).test(pathStr);
}


function walk(root) {

	var _walk = function(dir) {
		var dirs = [];
		var files = [];
		fs.readdirSync(dir).forEach(function(filename) {
			if (isDotfile(filename)) {
				// ignore dot files
				return;
			}

			// get info of file
			var ap  = path.resolve(dir, filename),
				rp = path.relative(root, ap),
				s  = stat(ap),
				fileInfo = {dir: dir, filename: filename, path: ap, rpath: rp, stat: s}
				;

			if (s.isFile()) {

				// file
				files.push(fileInfo);
			} else if (s.isDirectory()) {

				// dir
				dirs.push(fileInfo);

				// recursively _walk
				var res = _walk(ap);
				dirs = dirs.concat(res.dirs);
				files = files.concat(res.files);
			}
		});

		return {
			dirs: dirs,
			files: files
		};
	};

	return _walk(root);
}


/**
 * convert specified response text file into response object
 * ({status, header, body})
 * @param {string} filepath path to response text
 * @return {object} {status, header, body}
 */
function convertToResponse(filepath) {
	var texts = fs.readFileSync(filepath, 'utf8');

	var headerAndBody = texts.split('\n\n');

	var headerLines = headerAndBody[0].split('\n');

	// get status from first line of headers
	var statusLine = headerLines.shift();
	var statusCode = statusLine.split(' ')[1];

	// convert header-lines into headers-object
	var headers = _.reduce(headerLines, function(accum, line) {
		var keyAndVal = line.split(': ');
		accum[keyAndVal[0]] = keyAndVal[1];
		return accum;
	}, {});

	var body = headerAndBody[1];

	return {
		status: parseInt(statusCode),
		header: headers,
		body: body
	};
}

/**
 * construct response texts and return it.
 * if cache exists, returns the cache.
 * @param {string} dir directory that contains fake response texts
 */
function mapResponse(dir) {

	// return cache
	if (!_.isEmpty(mapCache)) {
		return mapCache;
	}


	var walked = walk(dir);
	var responseMap = _.reduce(walked.files, function (accum, info) {

		// name is relative path, excluded extention part
		var name = path.join(
			path.dirname(info.rpath),
			path.basename(info.rpath, path.extname(info.rpath))
		);
		accum[name] = convertToResponse(info.path);
		return accum;
	}, {});

	// cache
	mapCache = responseMap;
	return responseMap;
}

var mapForExpress = {};

/**
 * high-level helper:
 * create response map and return it.
 * if cache exists, returns the cache.
 * @param {boolean} force set true to override cache
 */
function mapResponseForExpress(force) {
	if (!_.isEmpty(mapForExpress) && !force) {
		return mapForExpress;
	}

	var dir = path.resolve(__dirname, 'resources');

	var map = mapResponse(dir);
	mapForExpress = map;
	return map;
}


function spyResponse(resourcePath) {
	var res_map = mapResponseForExpress();
	var resource = res_map[resourcePath];
	delete resource.header.Connection;
	var refundHandler = function(req, res) {
		res.set(resource.header);
		res.send(resource.status, resource.body);
	};
	return sinon.spy(refundHandler);
}

var webpay = require('../');
var http = require('http');
var express = require('express');
var server;
var mock;

function startServer() {
	webpay.api_base = 'http://localhost:2121';
	mock = express();

	mock.use(express.json());
	mock.use(express.urlencoded());

	server = http.createServer(mock).listen(2121);
}

function stopServer() {
	server.close();
}

module.exports = {
	startServer: startServer,
	stopServer: stopServer,
	mapResponseForExpress: mapResponseForExpress,
	spyResponse: spyResponse,
	get mock() {
		return mock;
	}
};
