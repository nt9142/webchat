(function (module) {
	var util = require('util');
	var Model = require('./');

	var User = function (nick, instance) {
		User.super_.apply(this, arguments);

		this.set('nickname', nick);

		this.set('isOnline', true);
		this.set('timestamp', Date.now());

		this.updateInstance(instance);
	};

	util.inherits(User, Model);

	User.prototype.updateInstance = function (instance) {
		this.setIndirectly('instance', instance);
	}

	module.exports = User;
})(module);