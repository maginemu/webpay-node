var expect = require('chai').expect;

module.exports = {
	/**
	 *
	 * @param {sinon.spy} spy
	 * @param {Error} err
	 * @param {Object} res
	 */
	invalidId: function(spy, err, res) {
		expect(err.name).to.equal('InvalidRequestError');
		expect(err).to.have.property('type').and.equal('invalid_request_error');
		expect(err).to.have.property('message').and.equal('ID must not be empty');
		expect(err).to.have.property('param').and.equal('id');
		expect(res).to.not.be.ok;
		expect(spy.called).to.be.false;
	}
};
