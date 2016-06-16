(function (module) {
	var util = require('util');
	var Model = require('./');

	var Message = function (params) {
		Message.super_.apply(this, arguments);
		
		this.set('sender', params.sender);
		this.set('style', params.style || []);
		this.set('text', params.text);
		this.set('timestamp', Date.now());
		
		this.setIndirectly('recipients', params.recipients);
	};

	util.inherits(Message, Model);

	module.exports = Message;
})(module);