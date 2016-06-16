/* global module */
(function () {
	var Data = require('src/node/data'),
			EventEmitter = require('events'),
			MessageManager = function () {
				this._messages = [];
				this._eventEmitter = new EventEmitter();
			};
	Object.assign(MessageManager.prototype, {
		sendChat: function (sender, body, recipients, style) {
			this._send('chat', style, sender, body, recipients);
		},
		sendSystem: function (instances, type, body, isSuccess) {
			this._eventEmitter.emit('system', new Data.SystemMessage({
				type: type,
				body: body,
				isSuccess: isSuccess,
				instances: instances
			}));
		},
		_send: function (type, style, sender, body, recipients) {
			var message = new Data.Message({
				sender: sender,
				type: type,
				style: style,
				body: body,
				recipients: recipients
			});
			this._messages.push(message);
			this._eventEmitter.emit('message', message);
		},
		getList: function (user) {
			return this._messages
					.filter(function (message) {
						return message.get('recipients').indexOf(user) !== -1 || message.get('timestamp') > user.get('timestamp');
					})
					.map(function (message) {
						return message.data();
					});
		},
		onMessage: function (callback) {
			this._eventEmitter.on('message', callback);
		},
		onSystem: function (callback) {
			this._eventEmitter.on('system', callback);
		}
	});


	MessageManager.SYSTEM = 'system';
	MessageManager.CHAT = 'chat';
	MessageManager.LIST = 'list';

	module.exports = MessageManager;
})();