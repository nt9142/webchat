(function (module) {
	var util = require('util');
	var Model = require('./');

	var SystemMessage = function (params) {
		SystemMessage.super_.apply(this, arguments);

		var isSuccess = params.isSuccess !== undefined ? params.isSuccess : true;

		this.set('type', params.type);
		this.set('text', params.text);
		this.set('isSuccess', isSuccess);

		this.setIndirectly('instance', params.instance);
	};

	util.inherits(SystemMessage, Model);

	module.exports = SystemMessage;
})(module);