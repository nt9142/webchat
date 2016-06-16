(function (module) {
	var util = require('util');
	var Response = require('./');

	var SystemResponse = function (system) {
		SystemResponse.super_.apply(this, arguments);

		this.set('type', system.get('type'));
		this.set('content', {
			text: system.get('text'),
			isSuccess: system.get('isSuccess')
		});
	};

	util.inherits(SystemResponse, Response);

	module.exports = SystemResponse;
})(module);