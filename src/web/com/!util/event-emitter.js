/* global WSC */
(function () {
	WSC.Util.EventEmitter = function () {
		this._subscribes = {};
	};

	WSC.Util.extend(WSC.Util.EventEmitter, {
		/**
		 * Subscribe to events function
		 * 
		 * @param {string|function} event or callback
		 * @param {function} [callback]
		 * 
		 * @returns {undefined}
		 */
		on: function (event, callback) {
			var args = this._normalizeArgs(event, callback);

			if (!this._subscribes[args.event]) {
				this._subscribes[args.event] = [];
			}
			this._subscribes[args.event].push(args.callback);
		},
		/**
		 * Unsubscribe to events function
		 * 
		 * @param {string|function} event or callback
		 * @param {function} [callback]
		 * 
		 * @returns {undefined}
		 */
		off: function (event, callback) {
			var args = this._normalizeArgs(event, callback), i = 0;

			if (this._subscribes[args.event]) {
				if (args.callback) {
					for (i = 0; i < this._subscribes[args.event].length; i++) {
						if (this._subscribes[args.event][i] === args.callback) {
							this._subscribes[args.event].splice(i, 1);
							break;
						}
					}
				} else {
					this._subscribes[args.event] = [];
				}
			}

		},
		/**
		 * Events emit function
		 * 
		 * @param {string} [event=WSC.Util.EventEmitter._defaultEvent]
		 * @param {mixed} data
		 * @returns {undefined}
		 */
		emit: function (event, data) {
			event = event || this._defaultEvent;

			if (this.hasListeners(event)) {
				this._subscribes[event].forEach(function (callback) {
					callback(data);
				});
			}
		},
		/**
		 * Return callable function for event emitting
		 * 
		 * @param {string} [event]
		 * @returns {function}
		 */
		emitFn: function (event) {
			return this.emit.bind(this, event);
		},
		/**
		 * Return boolean value: if event has listners
		 * @param {string} event
		 * @returns {boolean}
		 */
		hasListeners: function (event) {
			return this._subscribes[event] && this._subscribes[event].length;
		},
		_normalizeArgs: function (event, callback) {
			if (typeof event === 'function') {
				callback = event;
				event = this._defaultEvent;
			}

			return {
				event: event,
				callback: callback
			};
		},
		_defaultEvent: 'default'
	});
})();