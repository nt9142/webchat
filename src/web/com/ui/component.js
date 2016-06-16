/* global WSC, fetch */
(function () {
	var Component = function () {
		this._node = null;
		this._content = null;
		this._emitter = new WSC.Util.EventEmitter();

		this._emitter.on('load', this._onLoad.bind(this));
		this._emitter.on('render', this._onRender.bind(this));
		this._emitter.on('destroy', this._onDestroy.bind(this));

		this._load();
	};

	WSC.Util.extend(Component, {
		/**
		 * Template Component URL
		 * @abstract
		 */
		templateUrl: null,
		/**
		 * 
		 * @param node
		 * @returns {undeifned}
		 */
		renderTo: function (node) {
			this._content
					.then(function () {
						if (node.firstChild) {
							node.replaceChild(this._node, node.firstChild);
						} else {
							node.appendChild(this._node);
						}

						this._emitter.emit('render');
					}.bind(this));
		},
		/**
		 * 
		 * @param {type} node
		 * @returns {undefined}
		 */
		appendTo: function (node) {
			this._content
					.then(function () {
						node.appendChild(this._node);
						this._emitter.emit('render');
					}.bind(this));
		},
		getElement: function (selector) {
			if (this._node) {
				return this._node.querySelector(selector);
			}
			return null;
		},
		/**
		 * 
		 * @returns {undefined}
		 */
		_onRender: function () {
		},
		_onLoad: function () {
		},
		_onDestroy: function () {

		},
		destroy: function () {
			this._emitter.emit('destroy');
		},
		_load: function () {
			this._content = this._getContent()
					.then(this._createNode.bind(this))
					.catch(function (err) {
						throw Error('Template loading error has occured. ' + err);
					});
		},
		_getContent: function () {
			return fetch(this.templateUrl).then(function (response) {
				return response.text();
			});
		},
		_createNode: function (content) {
			var fragment;
			fragment = WSC.Util.createFragment(content);
			this._node = fragment.childNodes[1];
			this._emitter.emit('load');
		}
	});
	WSC.UI.Component = Component;
})();