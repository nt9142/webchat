/* global WSC */
WSC.UI.Auth = function () {
	WSC.UI.Component.call(this, arguments);

	this.messageProcessor = this.messageProcessor.bind(this);
};

WSC.Util.extend(WSC.UI.Auth, WSC.UI.Component, {
	templateUrl: '/templates/com-ui-auth-auth.html',
	_onLoad: function () {
		WSC.Util.provider.when('message', this.messageProcessor);
	},
	_onRender: function () {
		this.getElement('#auth').addEventListener('submit', function (e) {
			var val = this.getElement('#nickname').value;
			e.preventDefault();
			if (val.length) {
				WSC.Util.provider.send('auth', this.getElement('#nickname').value);
			}
		}.bind(this));
	},
	_onDestroy: function () {
		WSC.Util.provider.off('message', this.messageProcessor);
	},
	messageProcessor: function (message) {
		if (message.type === 'auth') {
			if (message.content.isSuccess) {
				WSC.Util.Storage.user = message.content.body;
				WSC.Util.Route.changeLocation('/chat');
			} else {
				this.getElement('.error').innerHTML = message.content.body;
			}
		}
	}
});