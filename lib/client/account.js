/*global module: true */

var account = function(client) {

	return {

		retrieve: function (callback) {
			return client._execute({method: 'get', path: '/account', callback: callback});
		},

		deleteData: function (callback) {
			var proxy = null;
			if (callback) {
				proxy = function (err, res) {
					if (err) {
						return callback(err);
					}
					return callback(null, res.deleted);
				};
			}
			return client._execute({method: 'del', path: '/account/data', callback: proxy});
		}
	};
};

module.exports = account;
