(function (module) {
	var util = require('util');
	var Model = require('./');

	var SystemMessage = function (params) {
		SystemMessage.super_.apply(this, arguments);

		var isSuccess = params.isSuccess !== undefined ? params.isSuccess : true,
				instances = params.instances;

		this.set('type', params.type);
		this.set('body', params.body);
		this.set('isSuccess', isSuccess);


		if (Object.prototype.toString.call(instances) !== '[object Array]') {
			instances = [instances];
		}

		this.setIndirectly('instances', instances);
	};

	util.inherits(SystemMessage, Model);

	module.exports = SystemMessage;
})(module);