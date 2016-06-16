/* global WSC, window, history */
(function () {
	var popStateEmitter = new WSC.Util.EventEmitter();
	var Route = function () {
		// this._pages = {};
		this._defaultPage = null;
		this._eventEmitter = new WSC.Util.EventEmitter();

		window.addEventListener('popstate', this._process.bind(this), false);
		window.addEventListener('load', this._process.bind(this), false);
		popStateEmitter.on(this._process.bind(this));
	};

	WSC.Util.extend(Route, {
		when: function (page, callback) {
			this._eventEmitter.on(page, callback);

			return this;
		},
		otherwise: function (page) {
			this._defaultPage = page;

			return this;
		},
		_process: function () {
			var page;
			page = location.pathname;

			if (!this._eventEmitter.hasListeners(page)) {
				this._changeLocation(this._defaultPage);
				return;
			}

			this._eventEmitter.emit(page);
		},
		_changeLocation: function (page) {
			Route.changeLocation(page);
		}
	});

	Route.changeLocation = function (page) {
		history.pushState(null, null, page);
		popStateEmitter.emit();
	};

	WSC.Util.Route = Route;
})();