/* global WSC */
WSC.UI.Chat = function () {
	WSC.UI.Component.call(this, arguments);

	this.messageProcessor = this.messageProcessor.bind(this);
};

WSC.Util.extend(WSC.UI.Chat, WSC.UI.Component, {
	templateUrl: '/templates/com-ui-chat-chat.html',
	messageProcessor: function (message) {
		var chatMsg;
		if (message.type === 'auth' && !message.content.isSuccess) {
			WSC.Util.Route.changeLocation('/auth');
			return;
		}

		if (message.type === 'messages') {
			message.content.body.forEach(function (messageContent) {
				var message = new WSC.UI.Message(messageContent);
				message.appendTo(this.getElement('.messages-box .content'));
			}.bind(this));

			this._scrollDown();
		}
		
		if (message.type === 'users') {
			this.getElement('.users-box .content').innerHTML = '';
			message.content.body.forEach(function (userContent) {
				var user = new WSC.UI.User(userContent);
				user.appendTo(this.getElement('.users-box .content'));
			}.bind(this));

			this._scrollDown();
		}

		if (message.type === 'chat') {
			chatMsg = new WSC.UI.Message(message.content);

			chatMsg.appendTo(this.getElement('.messages-box .content'));
			this._scrollDown();
		}


	},
	disconnectProcessor: function () {
		WSC.Util.Route.changeLocation('/disconnected');
	},
	_onLoad: function () {
		WSC.Util.provider.when('message', this.messageProcessor);
		WSC.Util.provider.when('close', this.disconnectProcessor);
	},
	_onRender: function () {
		WSC.Util.provider.send('messages', null);
		WSC.Util.provider.send('users', null);

		this.getElement('#message-area').addEventListener('keypress', function (event) {
			if (event.keyCode === 13 && !event.shiftKey && event.target.value.length) {
				WSC.Util.provider.send('chat', event.target.value);
				setTimeout(function () {
					event.target.value = '';
				}, 0);
			}
		});

	},
	_onDestroy: function () {
		WSC.Util.provider.off('message', this.messageProcessor);
		WSC.Util.provider.off('close', this.disconnectProcessor);
	},
	_scrollDown: function () {
		setTimeout(function () {
			var content = this.getElement('.messages-box .content');
			content.scrollTop = content.scrollHeight;
		}.bind(this), 100);
	}
});