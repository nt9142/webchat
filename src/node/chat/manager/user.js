/* global module */
(function () {
	var Data = require('src/node/data'),
			UserManager = function () {
				this._users = [];
			};
	Object.assign(UserManager.prototype, {
		authUser: function (nick, instance) {
			var user;

			if (!nick) {
				return UserManager.E_WRONG_DATA;
			}

			user = this.getUserByNick(nick);

			if (this.getUser(instance)) {
				return UserManager.E_ALREADY_AUTHORIZED;
			}

			if (!user) {
				this._addUser(nick, instance);
				return UserManager.NEW_USER;
			}

			if (user.get('isOnline')) {
				return UserManager.E_NICK_USED;
			}

			user.updateInstance(instance);
			user.set('isOnline', true);
			return UserManager.EXISTING_USER;
		},
		getUser: function (instance) {
			return this._users.find(function (user) {
				return user.get('instance') === instance;
			});
		},
		getUserByNick: function (nick) {
			return this._users.find(function (user) {
				return user.get('nickname') === nick;
			});
		},
		allOnlineUsers: function () {
			return this._users.filter(function (user) {
				return user.get('isOnline');
			});
		},
		getInstancesOf: function (arr) {
			return arr.map(function (user) {
				return user.get('instance');
			});
		},
		setUserOffline: function (user) {
			user.set('isOnline', false);
			return user;
		},
		_addUser: function (nick, instance) {
			if (!this.getUser(instance)) {
				this._users.push(new Data.User(nick, instance));
			}
		},
		_isNickExists: function (nick) {
			return this._users.some(function (user) {
				return user.get('nickname') === nick;
			});
		}
	});

	UserManager.E_ALREADY_AUTHORIZED = 1;
	UserManager.E_NICK_USED = 2;
	UserManager.E_WRONG_DATA = 3;
	UserManager.NEW_USER = 4;
	UserManager.EXISTING_USER = 5;

	module.exports = UserManager;
})();