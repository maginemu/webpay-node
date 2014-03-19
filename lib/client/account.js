/*global module: true */

var account = function(client) {

	return {

		retrieve: function (callback) {
			return client._execute({method: 'get', path: '/account/retrieve', callback: callback});
		},

		deleteData: function (callback) {
			return client._execute({method: 'del', path: '/account/delete/data', callback: function (err, res) {
				if (err) {
					return callback(err);
				}
				return callback(null, res.deleted);
			}});
		}
	};
};

module.exports = account;
