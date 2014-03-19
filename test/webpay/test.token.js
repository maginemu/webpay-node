/*global describe:true, it:true, beforeEach: true, afterEach: true */
'use strict';

var expect = require('chai').expect;

var helper = require('../helper');
var matcher = require('../matcher');

var webpay = require('../../');

describe('webpay.token', function() {
  beforeEach(helper.startServer);

  afterEach(helper.stopServer);

  describe('.create', function() {
    var params = {
      number: '4242-4242-4242-4242',
      exp_month: 12,
      exp_year: 2015,
      cvc: 123,
      name: 'YUUKO SHIONJI'
    };
    var spy;

    beforeEach(function() {
      spy = helper.spyResponse('tokens/create');
      helper.mock.post('/v1/tokens', spy);
    });

    it('should create token', function(done) {
      webpay.client.token.create(params, function(err, res) {
        expect(err).to.not.exist;
        expect(res.id).to.equal('tok_3dw2T20rzekM1Kf');
        expect(res.used).to.equal(false);
        expect(res.card.name).to.equal('YUUKO SHIONJI');

        expect(spy.calledOnce).to.be.true;
        expect(spy.args[0][0].body).to.deep.equal(params);
        done();
      });
    });
  });

  describe('.retrieve', function() {
    it('should get existing token with full information', function(done) {
      var id = 'tok_3dw2T20rzekM1Kf';
      var spy = helper.spyResponse('tokens/retrieve');
      helper.mock.get('/v1/tokens/:id', spy);

      webpay.client.token.retrieve(id, function(err, res){
        expect(err).to.not.exist;
        expect(res.id).to.equal('tok_3dw2T20rzekM1Kf');
        expect(res.used).to.equal(false);
        expect(res.card.name).to.equal('YUUKO SHIONJI');

        expect(spy.calledOnce).to.be.true;
        expect(spy.args[0][0].params.id).to.equal(id);
        done();
      });
    });

    it('should return error for empty id', function(done) {
      var spy = helper.spyResponse('tokens/retrieve');
      helper.mock.get('/v1/tokens/:id', spy);

      webpay.client.token.retrieve('', function(err, res){
        matcher.invalidId(spy, err, res);
        done();
      });
    });
  });
});
