(function (module) {
	var util = require('util');
	var Model = require('./');

	var Message = function (params) {
		Message.super_.apply(this, arguments);
		
		var isSuccess = params.isSuccess !== undefined ? params.isSuccess : true;


		this.set('sender', params.sender);
		this.set('type', params.type);
		this.set('style', params.style || 'default');
		this.set('text', params.text);
		this.set('isSuccess', isSuccess);
		
		this.setIndirectly('recipients', params.recipients);
	};

	util.inherits(Message, Model);

	module.exports = Message;
})(module);