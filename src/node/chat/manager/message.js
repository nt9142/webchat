/* global module */
(function () {
	var Data = require('src/node/data'),
			EventEmitter = require('events'),
			MessageManager = function () {
				this._messages = [];
				this._eventEmitter = new EventEmitter();
			};
	Object.assign(MessageManager.prototype, {
		sendChat: function (sender, text, recipients) {
			this._send(MessageManager.CHAT, sender, text, recipients);
		},
		sendList: function (sender, text, recipients) {
			this._send(MessageManager.LIST, sender, text, recipients);
		},
		sendSystem: function (sender, text, recipients) {
			this._send(MessageManager.SYSTEM, sender, text, recipients);
		},
		_send: function (type, sender, text, recipients) {
			var message = new Data.Message({
				sender: sender,
				type: type,
				text: text,
				recipients: recipients
			});
			this._messages.push(message);
			this._eventEmitter.emit('message', message);
		},
		getList: function (user) {
			return this._messages
					.filter(function (message) {
						return message.get('recipients').indexOf(user) !== -1;
					})
					.map(function (message) {
						return message.data();
					});
		},
		onMessage: function (callback) {
			this._eventEmitter.on('message', callback);
		},
		offMessage: function (callback) {
			this._eventEmitter.off('message', callback);
		}
	});


	MessageManager.SYSTEM = 'system';
	MessageManager.CHAT = 'chat';
	MessageManager.LIST = 'list';

	module.exports = MessageManager;
})();