var express = require('express'),
		config = require('./configuration'),
		WS = require('./src/node/ws'),
		argv = require('yargs').argv,
		app = express(),
		WebSocketServer;

WebSocketServer = new WS(config.ws_port, argv.debug);


app.use(express.static('./dist'));

if (argv.debug) {
	app.use('/src/web', express.static('./src/web'));
}

app.use(function (req, res) {
	res.sendFile(__dirname + '/dist/');
});

app.listen(config.port, function () {
	console.log('Express server listening on port ' + config.port);
});