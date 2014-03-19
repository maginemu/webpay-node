/*global describe:true, it:true, beforeEach: true, afterEach: true */
var expect = require('chai').expect;

var helper = require('../helper');
var matcher = require('../matcher');

var webpay = require('../../');

describe('webpay.event', function() {
	beforeEach(helper.startServer);

	afterEach(helper.stopServer);

	describe('.retrieve', function() {
		var id = 'evt_39o9oUevb5NCeM1';
		var spy;

		beforeEach(function() {
			spy = helper.spyResponse('events/retrieve');
			helper.mock.get('/v1/events/:id', spy);
		});

		it('should get existing event with full information', function(done) {
			webpay.client.event.retrieve(id, function(err, res){
				expect(err).to.not.exist;
				expect(res.id).to.equal(id);
				expect(res.type).to.equal('customer.created');
				expect(res.data.object.object).to.equal('customer');
				expect(res.data.object.email).to.equal('customer@example.com');

				expect(spy.calledOnce).to.be.true;
				expect(spy.args[0][0].params.id).to.equal(id);
				done();
			});
		});

		it('should return error for empty id', function(done) {
			webpay.client.event.retrieve('', function(err, res){
				matcher.invalidId(spy, err, res);
				done();
			});
		});
	});

	describe('.all', function() {
		it('should get list of events', function(done) {
			var spy = helper.spyResponse('events/all_with_type');
			helper.mock.get('/v1/events', spy);

			webpay.client.event.all({
				type: '*.created'
			}, function(err, res){
				expect(err).to.not.exist;
				expect(res.count).to.equal(5);
				expect(res.url).to.equal('/v1/events');
				expect(res.data[0].type).to.equal('customer.created');

				expect(spy.calledOnce).to.equal(true);
				var q = spy.args[0][0].query;
				expect(q.type).to.equal('*.created');

				done();
			});
		});
	});
});
