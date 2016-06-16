/* global module */
(function () {
	var Data = require('src/node/data'),
			EventEmitter = require('events'),
			MessageManager = function () {
				this._messages = [];
				this._eventEmitter = new EventEmitter();
			};
	Object.assign(MessageManager.prototype, {
		sendChat: function (sender, text, recipients, style) {
			this._send('chat', style, sender, text, recipients);
		},
		sendSystem: function (instance, type, text, isSuccess) {
			this._eventEmitter.emit('system', new Data.SystemMessage({
				type: type,
				text: text,
				isSuccess: isSuccess,
				instance: instance
			}));
		},
		_send: function (type, style, sender, text, recipients) {
			var message = new Data.Message({
				sender: sender,
				type: type,
				style: style,
				text: text,
				recipients: recipients
			});
			this._messages.push(message);
			this._eventEmitter.emit('message', message);
		},
		getList: function (user) {
			console.log('COUNT', this._messages.length);
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