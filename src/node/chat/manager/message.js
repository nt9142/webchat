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
			this._send('chat', null, sender, text, recipients);
		},
		sendSystem: function (type, sender, text, recipients, isSuccess) {
			this._send(type, 'system', sender, text, recipients, isSuccess);
		},
		_send: function (type, style, sender, text, recipients, isSuccess) {
			var message = new Data.Message({
				sender: sender,
				type: type,
				style: style,
				text: text,
				recipients: recipients,
				isSuccess: isSuccess
			});
			this._messages.push(message);
			this._eventEmitter.emit('message', message);
		},
		getList: function (user) {
			return this._messages
					.filter(function (message) {
						return (!message.get('recipients') || message.get('recipients').indexOf(user) !== -1) && message.get('type') === 'chat' ;
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