/* global module, console, Object */
(function () {
	var ws = new require('ws'),
			Data = require('src/node/data'),
			responseHandler = require('src/node/chat/response-handler'),
			generateGuid = require('src/node/util/generate-guid');
	var WebSocketServer = function (port, isDebug) {
		this.clients = {};
		this.isDebug = isDebug;

		this.server = new ws.Server({
			port: port
		});

		this.initBindings();
		responseHandler.onMessage(function (message) {
			var res = new Data.MessageResponse(message).data();
			if(res) {
				console.log(res.content.text);
			}
			
			
			
			
			
			var recipients = message.get('recipients'),
					response = JSON.stringify(new Data.MessageResponse(message).data()), key;
			for (key in recipients) {
				recipients[key].get('instance').send(response);
			}
			
			this.debugLog('response: ' + response);
		}.bind(this));
	};

	Object.assign(WebSocketServer.prototype, {
		initBindings: function () {
			this.server.on('connection', function (ws) {
				var guid = generateGuid();
				this.debugLog('new connection: ' + guid);
				responseHandler.processConnection(guid, ws);

				ws.on('message', function (message) {
					var parsedMessage = JSON.parse(message);

					this.debugLog('received message: ' + message);

					responseHandler.processMessage(guid, parsedMessage);

				}.bind(this));

				ws.on('close', function () {
					this.debugLog('connection closed ' + guid);
					responseHandler.processDisconnection(guid);
				}.bind(this));

			}.bind(this));
		},
		debugLog: function (message) {
			if (this.isDebug) {
				console.log(message);
			}
		}
	});

	module.exports = WebSocketServer;
})();