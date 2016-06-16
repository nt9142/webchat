/* global document */
document.addEventListener('DOMContentLoaded', function () {
	var content = WSC.Util.select('.page-content'),
			route = new WSC.Util.Route(),
			app = new WSC.Util.App(content);
			

	route
			.when('/auth', function () {
				app.renderPage(new WSC.UI.Auth());
			})
			.when('/chat', function () {
				app.renderPage(new WSC.UI.Chat());
			})
			.when('/disconnected', function () {
				app.renderPage(new WSC.UI.Disconnected());
			})
			.otherwise('/auth');
});