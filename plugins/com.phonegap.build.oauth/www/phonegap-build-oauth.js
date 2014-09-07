var PhonegapBuildOauth = {

	login: function(username, password, success, failure) {

			cordova.exec(success, failure, "PhonegapBuildOauth", "login", [username, password]);

	}

};

module.exports = PhonegapBuildOauth;