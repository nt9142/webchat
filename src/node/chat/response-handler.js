/* global module, Object */
(function () {
	var Data = require('src/node/data'),
			MessageManager = require('./manager/message'),
			UserManager = require('./manager/user'),
			/**
			 * Response handler singleton
			 */
			ResponseHandler = function () {
				this._msgManager = new MessageManager();
				this._userManager = new UserManager();


				this.responseText = {
					invalidStruct: 'Invalid message structure!',
					noNickname: 'Specify your nickname first!',
					nicknameChanged: 'Nickname is changed!',
					nicknameExists: 'Nickname is already exists!',
					alreadyRegistered: 'User is already registered!',
					notRecognizedCommand: 'The command is not recognized',
					greetingsNewUser: 'joined us! Yay!',
					goodbyeUser: 'left this chat.'
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
				this._msgManager.sendSystem('error', user, this.responseText.invalidStruct, [user]);
				return;
			}

			switch (response.get('type')) {
				case 'chat':
					chatAction.call(this);
					break;
				case 'auth':
					authAction.call(this);
					break;
				case 'users':
					usersAction.call(this);
					break;
				case 'messages':
					messagesAction.call(this);
					break;
				default:
					defaultAction.call(this);
					break;
			}


			function chatAction() {
				if (user.get('nickname')) {
					this._msgManager.sendChat(user, response.get('content'), this._userManager.allUsers());
				} else {
					this._msgManager.sendSystem('auth', user, this.responseText.noNickname, [user], false);
				}
			}

			function authAction() {
				var registerState = this._userManager.registerUser(user, response.get('content')),
						responseText;
				if (registerState === true) {
					this._msgManager.sendSystem('auth', user, this.responseText.nicknameChanged, [user], true);
					this._msgManager.sendSystem('chat', user, this.responseText.greetingsNewUser, this._userManager.allUsers());
				} else {
					responseText = registerState === UserManager.ALREADY_REGISTERED
							? this.responseText.alreadyRegistered
							: this.responseText.nicknameExists;
					this._msgManager.sendSystem('auth', user, responseText, [user], false);
				}
			}

			function usersAction() {
				this._msgManager.sendSystem('users', user, this._userManager.getList(), [user]);
			}

			function messagesAction() {
				if (user.get('nickname')) {
					this._msgManager.sendSystem('messages', user, this._msgManager.getList(user), [user]);
				} else {
					this._msgManager.sendSystem('auth', user, this.responseText.noNickname, [user], false);
				}
			}

			function defaultAction() {
				this._msgManager.sendSystem('error', user, this.responseText.notRecognizedCommand, [user]);
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
			this._msgManager.sendSystem('chat', this._userManager.getUser(guid), this.responseText.goodbyeUser);
		},
		onMessage: function (callback) {
			this._msgManager.onMessage(callback);
		}
	});

	module.exports = new ResponseHandler();
})();