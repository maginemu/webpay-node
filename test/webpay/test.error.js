/*global describe:true, it:true, beforeEach: true, afterEach: true */
var expect = require('chai').expect;

var helper = require('../helper');

var webpay = require('../../');

describe('webpay.error', function() {
	it('bad request', function(done) {
		helper.errorFromResponse('bad_request', function(error) {
			expect(error.name).to.equal('InvalidRequestError');
			expect(error.status).to.equal(400);
			expect(error.type).to.equal('invalid_request_error');
			expect(error.param).to.equal('currency');
			expect(error.message).to.equal('Missing required param: currency');
			done();
		});
	});

	it('unauthorized', function(done) {
		helper.errorFromResponse('unauthorized', function(error) {
			expect(error.name).to.equal('AuthenticationError');
			expect(error.status).to.equal(401);
			expect(error.message).to.equal('Invalid API key provided. Check your API key is correct.');
			done();
		});
	});

	it('card error', function(done) {
		helper.errorFromResponse('card_error', function(error) {
			expect(error.name).to.equal('CardError');
			expect(error.status).to.equal(402);
			expect(error.type).to.equal('card_error');
			expect(error.param).to.equal('number');
			expect(error.code).to.equal('incorrect_number');
			expect(error.message).to.equal('Your card number is incorrect');
			done();
		});
	});

	it('not found', function(done) {
		helper.errorFromResponse('not_found', function(error) {
			expect(error.name).to.equal('InvalidRequestError');
			expect(error.status).to.equal(404);
			expect(error.type).to.equal('invalid_request_error');
			expect(error.param).to.equal('id');
			expect(error.message).to.equal('No such charge: foo');
			done();
		});
	});

	it('api error', function(done) {
		helper.errorFromResponse('unknown_api_error', function(error) {
			expect(error.name).to.equal('ApiError');
			expect(error.status).to.equal(500);
			expect(error.type).to.equal('api_error');
			expect(error.message).to.equal('Unknown error occurred');
			done();
		});
	});

	it('The response JSON is broken', function(done) {
		helper.errorFromResponse('broken_json', function(error) {
			expect(error.name).to.equal('ApiConnectionError');
			expect(error.message).to.equal('Response JSON is broken');
			done();
		});
	});
});
