/* global module, Object */
(function () {
	var Data = require('src/node/data'),
			MessageManager = require('./manager/message'),
			UserManager = require('./manager/user'),
			/**
			 * Response handler singleton
			 */
			ResponseHandler = function () {
				this._messageManager = new MessageManager();
				this._userManager = new UserManager();


				this.responseText = {
					invalidStruct: 'Invalid message structure!',
					noNickname: 'Specify your nickname first!',
					nicknameChanged: 'Nickname is changed!',
					nicknameExists: 'Nickname already exists!',
					notRecognizedCommand: 'The command is not recognized'
				};
			};

	Object.assign(ResponseHandler.prototype, {
		/**
		 * Message processing function
		 * This function contains a logic of message processing.
		 * 
		 * @param {String} guid
		 * @param {Object} messageContent
		 * @returns {undefined}
		 */
		processMessage: function (guid, messageContent) {
			var response = new Data.Response(messageContent),
					user = this._userManager.getUser(guid);
			if (!user || !user.isValid()) {
				console.error('User not found!');
				return;
			}

			if (!response.isValid()) {
				this._messageManager.sendSystem(user, this.responseText.invalidStruct, [user]);
				return;
			}

			switch (response.get('type')) {
				case 'chat':
					if (user.get('nickname')) {
						this._messageManager.sendChat(user, response.get('content'));
					} else {
						this._messageManager.sendSystem(user, this.responseText.noNickname, [user]);
					}
					break;

				case 'nickname':
					if (this._userManager.setUserNickname(user, response.get('content'))) {
						this._messageManager.sendSystem(user, this.responseText.nicknameChanged, [user]);
					} else {
						this._messageManager.sendSystem(user, this.responseText.nicknameExists, [user]);
					}
					break;

				case 'users':
					this._messageManager.sendList(user, this._userManager.getList(), [user]);
					break;

				case 'messages':
					if (user.get('nickname')) {
						this._messageManager.sendList(user, this._messageManager.getList(user), [user]);
						break;
					}

				default:
					this._messageManager.sendSystem(user, this.responseText.notRecognizedCommand, [user]);
					break;
			}

		},
		/**
		 * Connection processing function
		 * 
		 * @param {String} guid
		 * @param {Object} instance
		 * @returns {undefined}
		 */
		processConnection: function (guid, instance) {
			this._userManager.addUser(guid, instance);
		},
		/**
		 * Disconnection processing function
		 * 
		 * @param {String} guid
		 * @returns {undefined}
		 */
		processDisconnection: function (guid) {
			this._userManager.setUserOffline(guid);
		},
		onMessage: function (callback) {
			this._messageManager.onMessage(callback);
		}
	});

	module.exports = new ResponseHandler();
})();