/* global WSC */
(function () {
	var extend = function () {
		var Target = arguments[0],
				Extenders = Array.prototype.slice.call(arguments).slice(1);

		Extenders.forEach(function (Extender) {
			if (Extender.prototype) {
				Target.prototype = Object.create(Extender.prototype);
				Target.prototype.constructor = Target;
			} else {
				Object.assign(Target.prototype, Extender);
			}
		});
	};
	WSC.Util.extend = extend;
})();