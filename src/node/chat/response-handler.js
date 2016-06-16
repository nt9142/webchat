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
					unauthorized: 'Unauthorized!',
					authorized: 'Authorized!',
					invalidStruct: 'Invalid message structure!',
					noNickname: 'Specify your nickname first!',
					userOnline: 'User is online!',
					noNick: 'Nickname is empty!',
					alreadyAuthorized: 'User is already authorized!',
					notRecognizedCommand: 'The command is not recognized',
					greetingsNewUser: 'joined us!',
					goodbyeUser: 'left this chat.'
				};
				
				this.resStyle = {
					joined: ['system', 'joined'],
					left: ['system', 'left']
				};
				
			};

	Object.assign(ResponseHandler.prototype, {
		/**
		 * Message processing function
		 * This function contains a logic of message processing.
		 * 
		 * @param {Object} instance
		 * @param {Object} response
		 * @returns {undefined}
		 */
		processMessage: function (instance, response) {
			var user = this._userManager.getUser(instance);

			if (response.get('type') === 'auth') {
				authAction.call(this);
				return;
			}

			if (!user || !user.isValid()) {
				unauthorizedAction.call(this);
				return;
			}

			if (!response.isValid()) {
				this._msgManager.sendSystem(instance, 'error', this.responseText.invalidStruct);
				return;
			}

			switch (response.get('type')) {
				case 'chat':
					chatAction.call(this);
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


			function authAction() {
				var registerState = this._userManager.authUser(response.get('content'), instance),
						responseText;
				if (registerState === true) {
					user = this._userManager.getUser(instance);
					this._msgManager.sendSystem(instance, 'auth', this.responseText.authorized, true);
					this._msgManager.sendChat(user, this.responseText.greetingsNewUser, this._onlineUsers(), this.resStyle.joined);
				} else {
					switch (registerState) {
						case UserManager.ALREADY_AUTHORIZED:
							responseText = this.responseText.alreadyAuthorized;
							break;
						case UserManager.NICK_USED:
							responseText = this.responseText.userOnline;
							break;
						default:
							responseText = this.responseText.noNick;
					}
					this._msgManager.sendSystem(instance, 'auth', responseText, false);
				}
			}

			function chatAction() {
				this._msgManager.sendChat(user, response.get('content'), this._onlineUsers());
			}


			function usersAction() {
				this._msgManager.sendSystem(instance, 'users', this._userManager.getList());
			}

			function messagesAction() {
				this._msgManager.sendSystem(instance, 'messages', this._msgManager.getList(user));
			}

			function defaultAction() {
				this._msgManager.sendSystem(instance, 'error', this.responseText.notRecognizedCommand);
			}

			function unauthorizedAction() {
				this._msgManager.sendSystem(instance, 'auth', this.responseText.unauthorized, false);
			}

		},
		/**
		 * Connection processing function
		 * 
		 * @param {Object} instance
		 * @returns {undefined}
		 */
		processConnection: function (instance) {
		},
		/**
		 * Disconnection processing function
		 * 
		 * @param {Object} instance
		 * @returns {undefined}
		 */
		processDisconnection: function (instance) {
			var user = this._userManager.getUser(instance);
			this._userManager.setUserOffline(user);
			this._msgManager.sendChat(user, this.responseText.goodbyeUser, this._onlineUsers(), this.resStyle.left);
		},
		onMessage: function (callback) {
			this._msgManager.onMessage(callback);
		},
		onSystem: function (callback) {
			this._msgManager.onSystem(callback);
		},
		_onlineUsers: function () {
			return this._userManager.allOnlineUsers();
		}
	});

	module.exports = new ResponseHandler();
})();