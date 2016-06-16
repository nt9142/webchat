(function (module) {
	var util = require('util');
	var Response = require('./');

	var MessageResponse = function (message) {
		MessageResponse.super_.apply(this, arguments);

		this.set('type', message.get('type'));
		this.set('content', {
			sender: message.get('sender'),
			text: message.get('text'),
			isSuccess: message.get('isSuccess')
		});
	};

	util.inherits(MessageResponse, Response);

	module.exports = MessageResponse;
})(module);