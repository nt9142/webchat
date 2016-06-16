/* global WSC */
WSC.UI.Message = function (params) {
	WSC.UI.Component.call(this, arguments);

	this.nickname = params.sender.nickname;
	this.isOnline = params.sender.isOnline;
	this.style = params.style;
	this.body = params.body;
	this.timestamp = params.timestamp;

};

WSC.Util.extend(WSC.UI.Message, WSC.UI.Component, {
	templateUrl: '/templates/com-ui-chat-message-message.html',
	_onRender: function () {
		var messageItem = this.getElement('.message-item');
		messageItem.classList.add.apply(messageItem.classList, this.style);

		if (this.nickname === WSC.Util.Storage.user.nickname) {
			messageItem.classList.add('own');
		}


		this.getElement('.nickname').innerHTML = this.nickname;
		this.getElement('.text').innerHTML = this.body;
		this.getElement('.time').innerHTML = new Date(this.timestamp).toLocaleString('ru-RU');
	}
});