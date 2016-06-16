/* global WSC */
WSC.UI.User = function (params) {
	WSC.UI.Component.call(this, arguments);
	
	this.nickname = params.nickname;
};

WSC.Util.extend(WSC.UI.User, WSC.UI.Component, {
	templateUrl: '/templates/com-ui-chat-user-user.html',
	_onRender: function () {
		this.getElement('.nickname').innerHTML = this.nickname;
	}
});