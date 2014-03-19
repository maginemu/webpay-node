/*global describe:true, it:true, beforeEach: true, afterEach: true */
var expect = require('chai').expect;

var helper = require('../helper');
var matcher = require('../matcher');

var webpay = require('../../');

describe('webpay.customer', function() {
	beforeEach(helper.startServer);

	afterEach(helper.stopServer);

	describe('.create', function() {
		var params = {
			description: 'Test Customer from Java',
			email: 'customer@example.com',
			card: {
				number: '4242-4242-4242-4242',
				exp_month: 12,
				exp_year: 2015,
				cvc: 123,
				name: 'YUUKO SHIONJI'
			}
		};
		var spy;

		beforeEach(function() {
			spy = helper.spyResponse('customers/create');
			helper.mock.post('/v1/customers', spy);
		});

		it('should create customer', function(done) {
			webpay.client.customer.create(params, function(err, res) {
				expect(err).to.not.exist;
				expect(res.id).to.equal('cus_39o4Fv82E1et5Xb');
				expect(res.description).to.equal('Test Customer from Java');
				expect(res.active_card.name).to.equal('YUUKO SHIONJI');

				expect(spy.calledOnce).to.be.true;
				expect(spy.args[0][0].body).to.deep.equal(params);
				done();
			});
		});
	});

	describe('.retrieve', function() {
		it('should get existing customer with full information', function(done) {
			var id = 'cus_39o4Fv82E1et5Xb';
			var spy = helper.spyResponse('customers/retrieve');
			helper.mock.get('/v1/customers/:id', spy);

			webpay.client.customer.retrieve(id, function(err, res){
				expect(err).to.not.exist;
				expect(res.id).to.equal(id);
				expect(res.description).to.equal('Test Customer from Java');
				expect(res.active_card.name).to.equal('YUUKO SHIONJI');

				expect(spy.calledOnce).to.be.true;
				expect(spy.args[0][0].params.id).to.equal(id);
				done();
			});
		});

		it('should get deleted customer with deleted flag', function(done) {
			var id = 'cus_7GafGMbML8R28Io';
			var spy = helper.spyResponse('customers/retrieve_deleted');
			helper.mock.get('/v1/customers/:id', spy);

			webpay.client.customer.retrieve(id, function(err, res){
				expect(err).to.not.exist;
				expect(res.id).to.equal(id);
				expect(res.deleted).to.be.true;
				expect(res.description).to.not.exist;
				done();
			});
		});

		it('should return error for empty id', function(done) {
			var spy = helper.spyResponse('customers/retrieve_deleted');
			helper.mock.get('/v1/customers/:id', spy);

			webpay.client.customer.retrieve('', function(err, res){
				matcher.invalidId(spy, err, res);
				done();
			});
		});
	});

	describe('.all', function() {
		it('should get list of customers', function(done) {
			var spy = helper.spyResponse('customers/all');
			helper.mock.get('/v1/customers', spy);

			webpay.client.customer.all({
				count: 3,
				offset: 0,
				created: { gt: 1378000000 }
			}, function(err, res){
				expect(err).to.not.exist;
				expect(res.count).to.equal(4);
				expect(res.url).to.equal('/v1/customers');
				expect(res.data[0].description).to.equal('Test Customer from Java');

				expect(spy.calledOnce).to.be.true;
				var q = spy.args[0][0].query;
				expect(q.count).to.equal('3');
				expect(q.offset).to.equal('0');
				expect(q.created).to.deep.equal({gt: '1378000000'});

				done();
			});
		});
	});

	describe('.update', function() {
		var id = 'cus_39o4Fv82E1et5Xb';
		var params = {
			description: 'New description',
			email: 'newmail@example.com',
			card: {
				number: '4242-4242-4242-4242',
				exp_month: 12,
				exp_year: 2016,
				cvc: 123,
				name: 'YUUKO SHIONJI'
			}
		};
		var spy;

		beforeEach(function() {
			spy = helper.spyResponse('customers/update');
			helper.mock.post('/v1/customers/:id', spy);
		});

		it('should update information of specified customer', function(done) {
			webpay.client.customer.update(id, params, function(err, res) {
				expect(err).to.not.exist;
				expect(res.description).to.equal('New description');
				expect(res.email).to.equal('newmail@example.com');
				expect(res.active_card.exp_year).to.equal(2016);

				expect(spy.args[0][0].params.id).to.equal(id);
				expect(spy.args[0][0].body).to.deep.equal(params);

				done();
			});
		});

		it('should call update without params', function(done) {
			webpay.client.customer.update(id, function(err, res) {
				expect(err).to.not.exist;
				expect(res.id).to.equal(id);

				expect(spy.args[0][0].params.id).to.equal(id);
				expect(spy.args[0][0].body).to.deep.equal({});

				done();
			});
		});
	});

	describe('.delete', function() {
		var id = 'cus_39o4Fv82E1et5Xb';
		var spy;

		beforeEach(function() {
			spy = helper.spyResponse('customers/delete');
			helper.mock.del('/v1/customers/:id', spy);
		});

		it('should delete the entity and retrieve deleted customer object', function(done) {
			webpay.client.customer.destroy(id, function(err, res) {
				expect(err).to.not.exist;
				expect(res).to.equal(true);

				expect(spy.calledOnce).to.equal(true);
				expect(spy.args[0][0].params.id).to.equal(id);

				done();
			});
		});

		it('should not call delete if id is empty', function(done) {
			webpay.client.customer.destroy('', function(err, res) {
				matcher.invalidId(spy, err, res);
				done();
			});
		});
	});
});
