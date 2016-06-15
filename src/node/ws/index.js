/* global module, console, Object */
(function () {
	var ws = new require('ws'),
			generateGuid = require('src/node/util/generate-guid');
	var WebSocketServer = function (port, isDebug) {
		this.clients = {};
		this.isDebug = isDebug;

		this.server = new ws.Server({
			port: port
		});

		this.initBindings();
	};

	Object.assign(WebSocketServer.prototype, {
		initBindings: function () {
			this.server.on('connection', function (ws) {

				var id = generateGuid();
				this.clients[id] = ws;
				this.isDebug && console.log('new connection ' + id);

				ws.on('message', function (message) {
					this.isDebug && console.log('received message: ' + message);

					for (var key in this.clients) {
						this.clients[key].send(message);
					}
				}.bind(this));

				ws.on('close', function () {
					this.isDebug && console.log('connection closed ' + id);
					delete this.clients[id];
				}.bind(this));

			}.bind(this));
		}
	});

	module.exports = WebSocketServer;
})();