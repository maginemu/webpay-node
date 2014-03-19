/*global describe:true, it:true, beforeEach: true, afterEach: true */
var expect = require('chai').expect;
var helper = require('../helper');

var webpay = require('../../');

describe('webpay.account', function() {
	beforeEach(helper.startServer);

	afterEach(helper.stopServer);

	describe('.retrieve', function() {
		it('expected to retrieve account object', function(done) {
			helper.mock.get('/v1/account', helper.spyResponse('account/retrieve'));

			webpay.client.account.retrieve(function(err, res) {
				expect(err).to.be.null;
				expect(res).to.have.property('object').and.eql('account');
				expect(res).to.have.property('id').and.eql('acct_2Cmdexb7J2r78rz');
				expect(res).to.have.property('email').and.eql('test-me@example.com');
				expect(res).to.have.property('currencies_supported').and.eql(['jpy']);
				done();
			});
		});
	});

	describe('.deleteData', function() {
		it('expected to return true', function(done) {
			helper.mock.del('/v1/account/data', helper.spyResponse('account/delete'));

			webpay.client.account.deleteData(function(err, res) {
				expect(err).to.be.null;
				expect(res).to.be.true;
				done();
			});
		});
	});
});
