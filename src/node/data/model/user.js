(function (module) {
	var util = require('util');
	var Model = require('./');

	var User = function (guid, instance) {
		User.super_.apply(this, arguments);

		this.set('guid', guid);
		this.set('nickname', null);

		this.set('isOnline', true);
		
		this.setIndirectly('instance', instance);
	};

	util.inherits(User, Model);

	module.exports = User;
})(module);