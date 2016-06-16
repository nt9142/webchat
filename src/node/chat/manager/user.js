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
				return UserManager.WRONG_DATA;
			}

			user = this.getUserByNick(nick);

			if (this.getUser(instance)) {
				return UserManager.ALREADY_AUTHORIZED;
			}

			if (!user) {
				this._addUser(nick, instance);
				return true;
			}

			if (user.get('isOnline')) {
				return UserManager.NICK_USED;
			}

			user.updateInstance(instance);
			user.set('isOnline', true);
			return true;
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
		getList: function () {
			return this._users.map(function (user) {
				return user.data();
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

	UserManager.ALREADY_AUTHORIZED = 1;
	UserManager.NICK_USED = 2;
	UserManager.WRONG_DATA = 3;

	module.exports = UserManager;
})();