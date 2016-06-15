(function (module) {
	var util = require('util');
	var Model = require('../');

	var Response = function (params) {
		Response.super_.apply(this, arguments);

		this.set('type', params.type);
		this.set('content', params.content);
	};

	util.inherits(Response, Model);

	module.exports = Response;
})(module);