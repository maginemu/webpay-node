/*global describe:true, it:true, beforeEach: true, afterEach: true */
var expect = require('chai').expect;
var _ = require('lodash');

var helper = require('../helper');
var matcher = require('../matcher');

var webpay = require('../../');

describe('webpay.charge', function() {
	beforeEach(helper.startServer);

	afterEach(helper.stopServer);


	describe('.create', function() {
		beforeEach(function() {
			var res_map = helper.mapResponseForExpress();
			var response_create_with_card = res_map['charges/create_with_card'];
			var response_create_with_customer = res_map['charges/create_with_customer'];

			helper.mock.post('/v1/charges', function(req, res) {
				var r = null;
				if (_.has(req.body, 'card')) {
					r = response_create_with_card;
				} else {
					r = response_create_with_customer;
				}
				delete r.header.Connection;
				res.set(r.header);
				res.send(r.status, r.body);
			});
		});

		it('should create a charge with card', function(done) {
			webpay.client.charge.create({
				amount: '1000',
				currency: 'jpy',
				card: {
					number: '4242-4242-4242-4242',
					exp_month: '12',
					exp_year: '2015',
					cvc: '123',
					name: 'YUUKO SHIONJI'
				},
				description: 'Test Charge from Java'
			}, function(err, res) {
				expect(err).to.not.exist;
				expect(res).to.have.property('id')
					.and.equal('ch_2SS17Oh1r8d2djE');
				expect(res).to.have.property('description')
					.and.equal('Test Charge from Java');
				expect(res).to.have.property('card')
					.and.have.property('name')
					.and.equal('YUUKO SHIONJI');

				done();
			});
		});

		it('should create a charge with customer', function(done) {
			webpay.client.charge.create({
				amount: '1000',
				currency: 'jpy',
				customer: 'cus_fgR4vI92r54I6oK',
				description: 'Test Charge from Java'
			}, function(err, res) {
				expect(err).to.not.exist;
				expect(res).to.have.property('id')
					.and.equal('ch_2SS4fK4IL96535y');
				expect(res).to.have.property('card')
					.and.have.property('name')
					.and.equal('KEI KUBO');

				done();
			});
		});
	});


	describe('.retrieve', function() {
		var id = 'ch_bWp5EG9smcCYeEx';
		var spy = null;

		beforeEach(function() {
			spy = helper.spyResponse('charges/retrieve');
			helper.mock.get('/v1/charges/:id', spy);
		});

		it('should retrieve proper charge', function(done) {
			webpay.client.charge.retrieve(id, function(err, res) {
				expect(res).to.have.property('id').and.equal(id);
				expect(res).to.have.property('card').and.have.property('fingerprint')
					.and.equal('215b5b2fe460809b8bb90bae6eeac0e0e0987bd7');
				done();
			});
		});

		it('should return error for empty id', function(done) {
			webpay.client.charge.retrieve('', function(err, res) {
				matcher.invalidId(spy, err, res);
				done();
			});
		});
	});


	describe('.refund', function() {
		var spy = null;
		beforeEach(function() {
			spy = helper.spyResponse('charges/refund');
			helper.mock.post('/v1/charges/:id/refund', spy);
		});

		var id = 'ch_bWp5EG9smcCYeEx';
		it('should refund the charge of specified id', function(done) {
			webpay.client.charge.refund(id, {amount: 400}, function(err, refundedCharge) {
				expect(refundedCharge.refunded).to.be.true;
				expect(spy.args[0][0].body.amount).to.equal(400);
				done();
			});
		});

		it('should refund the charge of specified id without amount', function(done) {
			webpay.client.charge.refund(id, function(err, refundedCharge) {
				expect(refundedCharge.refunded).to.be.true;
				done();
			});
		});

		it('should accept charge like object', function(done) {
			webpay.client.charge.refund({id: id}, {amount: 400}, function(err, refundedCharge) {
				expect(refundedCharge.id).to.equal(id);
				expect(spy.args[0][0].params.id).to.equal(id);
				done();
			});
		});

		it('should return error for empty id', function(done) {
			webpay.client.charge.refund('', function(err, res) {
				matcher.invalidId(spy, err, res);
				done();
			});
		});

		it('should return error for empty id of object', function(done) {
			webpay.client.charge.refund({id: ''}, function(err, res) {
				matcher.invalidId(spy, err, res);
				done();
			});
		});
	});


	describe('.all', function() {
		it('should return proper list with created[gt]', function(done) {
			var spy = helper.spyResponse('charges/all');
			helper.mock.get('/v1/charges', spy);

			webpay.client.charge.all({
				count: 3,
				offset: 0,
				created: { gt: 1378000000 }
			}, function(err, res) {
				var q = spy.args[0][0].query;
				expect(q.count).to.equal('3');
				expect(q.offset).to.equal('0');
				expect(q.created).to.deep.equal({gt: '1378000000'});

				expect(res.count).to.equal(11);
				expect(res.url).to.equal('/v1/charges');
				var data = res.data;
				expect(data.length).to.equal(3);
				expect(data[0].description).to.equal('Test Charge from Java');
				done();
			});
		});

		it('should return proper list with customer', function(done) {
			var spy = helper.spyResponse('charges/all');
			helper.mock.get('/v1/charges', spy);

			webpay.client.charge.all({
				customer: 'cus_fgR4vI92r54I6oK'
			}, function(err, res) {
				var q = spy.args[0][0].query;
				expect(q.customer).to.equal('cus_fgR4vI92r54I6oK');

				expect(res.count).to.equal(11);
				expect(res.url).to.equal('/v1/charges');
				var data = res.data;
				expect(data.length).to.equal(3);
				expect(data[0].description).to.equal('Test Charge from Java');
				done();
			});
		});
	});


	describe('.capture', function() {
		var id = 'ch_2X01NDedxdrRcA3';
		var spy = null;
		beforeEach(function() {
			spy = helper.spyResponse('charges/capture');
			helper.mock.post('/v1/charges/:id/capture', spy);
		});

		it('should capture the charge', function(done) {
			webpay.client.charge.capture(id, {amount: 1000}, function(err, res) {
				expect(err).to.not.exist;
				expect(res.id).to.equal(id);
				expect(res.captured).to.be.true;
				expect(res.amount).to.equal(1000);
				expect(spy.args[0][0].params.id).to.equal(id);
				expect(spy.args[0][0].body.amount).to.equal(1000);
				done();
			});
		});

		it('should capture the charge without amount param', function(done) {
			webpay.client.charge.capture(id, function(err, res) {
				expect(err).to.not.exist;
				expect(res.id).to.equal(id);
				expect(res.captured).to.be.true;
				expect(res.amount).to.equal(1000);
				expect(spy.args[0][0].params.id).to.equal(id);
				expect(spy.args[0][0].body).to.deep.equal({});
				done();
			});
		});

		it('should accept charge like object', function(done) {
			webpay.client.charge.capture({id: id}, {amount: 400}, function(err, res) {
				expect(res.id).to.equal(id);
				expect(spy.args[0][0].params.id).to.equal(id);
				done();
			});
		});

		it('should return error for empty id', function(done) {
			webpay.client.charge.capture('', function(err, res) {
				matcher.invalidId(spy, err, res);
				done();
			});
		});

		it('should return error for empty id of object', function(done) {
			webpay.client.charge.capture({id: ''}, function(err, res) {
				matcher.invalidId(spy, err, res);
				done();
			});
		});
	});
});
