/* global WSC, document */
WSC.Util.createFragment = function (htmlContent) {
	var fragment = document.createDocumentFragment(),
			temp = document.createElement('div');
	temp.innerHTML = htmlContent;
	while (temp.firstChild) {
		fragment.appendChild(temp.firstChild);
	}
	return fragment;
};