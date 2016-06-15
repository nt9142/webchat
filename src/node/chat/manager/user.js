/* global module */
(function () {
	var Data = require('src/node/data'),
			UserManager = function () {
				this._users = {};
			};
	Object.assign(UserManager.prototype, {
		addUser: function (guid, instance) {
			if (!this.getUser(guid)) {
				this._users[guid] = new Data.User(guid, instance);
			}
		},
		getUser: function (guid) {
			return this._users[guid] || false;
		},
		getUserInstances: function () {
			return this._users.map(function (user) {
				return user.get('instance');
			});
		},
		getList: function () {
			var key, result = [];
			for (key in this._users) {
				if (this._users.hasOwnProperty(key)) {
					result.push(this._users[key].data());
				}
			}
			return result;
		},
		setUserNickname: function (user, nickname) {
			if (this._isNicknameExists(nickname)) {
				return false;
			}
			user.set('nickname', nickname);
			return true;
		},
		setUserOffline: function (guid) {
			this.getUser(guid).set('isOnline', false);
		},
		_isNicknameExists: function (nickname) {
			var key;
			for (key in this._users) {
				if (this._users.hasOwnProperty(key)
						&& this._users[key].get('nickname') === nickname) {
					return true;
				}
			}
			return false;
		}
	});

	module.exports = UserManager;
})();