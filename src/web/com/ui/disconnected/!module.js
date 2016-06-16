/* global WSC */
(function () {
	var content = fetch('/templates/com-ui-disconnected-disconnected.html').then(function (response) {
				return response.text();
			});
	var Disconnected = function () {
		WSC.UI.Component.call(this, arguments);
	};

	WSC.Util.extend(Disconnected, WSC.UI.Component, {
		disconnectProcessor: function () {
			WSC.Util.Route.changeLocation('/chat');
		},
		_onLoad: function () {
			WSC.Util.provider.when('open', this.disconnectProcessor);
		},
		_onDestroy: function () {
			WSC.Util.provider.off('open', this.disconnectProcessor);
		},
		_getContent: function () {
			return content;
		}
	});

	WSC.UI.Disconnected = Disconnected;
})();