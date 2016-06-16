/* global WSC */
(function () {
	var Provider = function (url) {
		this._url = url;
		this._socket = null;
		this._emitter = new WSC.Util.EventEmitter();
		this._reconnectIntervalId = null;

		this._connect();

		this._emitter.on('close', this._reconnectInterval.bind(this));
		this._emitter.on('open', function () {
			clearInterval(this._reconnectIntervalId);
		}.bind(this));

	};

	WSC.Util.extend(Provider, {
		send: function (type, content) {
			this._socket.send(JSON.stringify({type: type, content: content}));
		},
		when: function (type, callback) {
			this._emitter.on(type, callback);
		},
		off: function (type, callback) {
			this._emitter.off(type, callback);
		},
		_initBindings: function () {
			this._socket.addEventListener('open', this._emitter.emitFn('open'));
			this._socket.addEventListener('close', this._emitter.emitFn('close'));
			this._socket.addEventListener('message', function (event) {
				this._emitter.emit('message', JSON.parse(event.data));
			}.bind(this));
			this._socket.addEventListener('error', this._emitter.emitFn('error'));
		},
		_connect: function () {
			this._socket = new WebSocket(this._url);
			this._initBindings();
		},
		_reconnectInterval: function () {
			clearInterval(this._reconnectIntervalId);
			this._reconnectIntervalId = setInterval(this._connect.bind(this), WSC.Util.random(3000, 10000));
		}
	});

	WSC.Util.provider = new Provider('ws://localhost:1337');
})();