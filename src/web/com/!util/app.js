/* global WSC */
WSC.Util.App = function (node) {
	this._node = node;
	this._component = null;
};

WSC.Util.extend(WSC.Util.App, {
	renderPage: function (component) {
		if(this._component) {
			this._component.destroy();
		}
		this._component = component;
		this._render();
	},
	_render: function () {
		if (this._component) {
			this._component.renderTo(this._node);
		}
	}
});