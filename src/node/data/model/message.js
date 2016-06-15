(function (module) {
	var util = require('util');
	var Model = require('./');

	var User = function (params) {
		User.super_.apply(this, arguments);

		this.set('sender', params.sender);
		this.set('type', params.type);
		this.set('text', params.text);
		
		this.setIndirectly('recipients', params.recipients);
	};

	util.inherits(User, Model);

	module.exports = User;
})(module);