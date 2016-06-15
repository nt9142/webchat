(function (module) {
	var Model = function (params) {
		this.container = {};
		this.indirectContainer = {};
	};
	Model.prototype.set = function (key, value) {
		return this.container[key] = value;
	};

	Model.prototype.get = function (key) {
		return this.container[key] !== undefined ? this.container[key] : this.indirectContainer[key];
	};

	Model.prototype.setIndirectly = function (key, value) {
		this.indirectContainer[key] = value;
	};

	Model.prototype.isValid = function () {
		for (var key in this.container) {
			if (this.container.hasOwnProperty(key) && this.container[key] === undefined) {
				return false;
			}
		}
		return true;
	};
	Model.prototype.data = function () {
		return data(this);
	};
	function data(obj) {
		if (obj instanceof Model) {
			return data(obj.container);
		}
		if (Object.prototype.toString.call(obj) === '[object Object]') {
			var result = {};
			for (var key in obj) {
				result[key] = data(obj[key]);
			}
			return result;
		}
		if (Object.prototype.toString.call(obj) === '[object Array]') {
			return obj.map(data);
		}
		return obj;
	}
	Model.data = data;
	module.exports = Model;
})(module);