/* global module, console, Object */
(function () {
	var ws = new require('ws'),
			Data = require('src/node/data'),
			responseHandler = require('src/node/chat/response-handler');
	var WebSocketServer = function (port, isDebug) {
		this.clients = {};
		this.isDebug = isDebug;

		this.server = new ws.Server({
			port: port
		});

		this.initBindings();

		responseHandler.onMessage(this._onMessageHandler.bind(this));
		responseHandler.onSystem(this._onSystemHandler.bind(this));
	};

	Object.assign(WebSocketServer.prototype, {
		initBindings: function () {
			this.server.on('connection', function (ws) {
				this.debugLog('new connection');
				responseHandler.processConnection(ws);

				ws.on('message', function (message) {
					var parsedMessage = new Data.Response(JSON.parse(message));

					this.debugLog('received message: ' + message);

					responseHandler.processMessage(ws, parsedMessage);

				}.bind(this));

				ws.on('close', function () {
					this.debugLog('connection closed');
					responseHandler.processDisconnection(ws);
				}.bind(this));

			}.bind(this));
		},
		debugLog: function (message) {
			if (this.isDebug) {
				console.log(message);
			}
		},
		_onSystemHandler: function (systemMessage) {
			var instance = systemMessage.get('instance'),
					response = JSON.stringify(new Data.SystemResponse(systemMessage).data());
			instance.send(response);
			
			this.debugLog('sys response: ' + response);
		},
		_onMessageHandler: function (message) {
			var recipients = message.get('recipients'),
					response = JSON.stringify(new Data.MessageResponse(message).data()), key;

			for (key in recipients) {
				recipients[key].get('instance').send(response);
			}

			this.debugLog('response: ' + response);
		}
	});

	module.exports = WebSocketServer;
})();