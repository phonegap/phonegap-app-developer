var access_token;

$("#login-form").on('submit', function(e) {
	e.preventDefault();

	var email = $(this).find("#email").val();
	var pass = $(this).find("#password").val();

	cordova.exec(function(a) {
		access_token = a.access_token;
		getApps(a.access_token);
	}, function(a) {
		console.log("Auth failure: " + a.message);
	}, "PhoneGapBuildOauth", "login", [email, pass]);

});

$("#login-form input[value='BACK']").on('click', function(e) {
	e.preventDefault();
	window.location.href='index.html'; 
	return false;
});

function getApps(access_token) {
	$.ajax({
	  dataType: "json",
	  url:"https://build.phonegap.com/api/v1/apps?access_token=" + access_token,
	  success: function(data) { 
	  	renderApps(data.apps);
	  }
	});
}

function renderApps(apps) {
	var list = $(".apps");
	list.html("");
	apps.forEach(function(app) {
		list.append("<li>" + "<a href='#' onclick='install(\"" + app.id + "\")'>" + app.title + "</a></li>");
	});
	list.removeClass("hidden");
	$('#login-form').addClass('hidden')
}

function install(id) {
	var download_url = "https://build.phonegap.com/apps/" + id + 
			"/download/" + device.platform.toLowerCase() + "?access_token=" + access_token;
	window.open(download_url, "_system");
}