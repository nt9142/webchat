(function (module) {
	var util = require('util');
	var Response = require('./');

	var MessageResponse = function (message) {
		MessageResponse.super_.apply(this, arguments);

		this.set('type', 'chat');
		this.set('content', message.data());
	};

	util.inherits(MessageResponse, Response);

	module.exports = MessageResponse;
})(module);