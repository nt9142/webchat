/* global module */
(function () {
	var Data = {};

	Data.Response = require('./model/response');
	Data.MessageResponse = require('./model/response/message');
	Data.SystemResponse = require('./model/response/system');
	Data.User = require('./model/user');
	Data.Message = require('./model/message');
	Data.SystemMessage = require('./model/system-message');

	Data.Model = require('./model');

	module.exports = Data;
})();