var PhonegapBuildOauth = {

	login: function(username, password, success, failure) {

			cordova.exec(success, failure, "PhonegapBuildOauth", "login", [username, password]);

	},

	authorizeByCode: function(code, success, failure) {

			cordova.exec(success, failure, "PhonegapBuildOauth", "authorizeByCode", [code]);

	}

};

module.exports = PhonegapBuildOauth;