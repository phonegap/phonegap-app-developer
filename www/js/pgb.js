(function() {
 
$(document).on('deviceready', function() {
	// Add slight delay to allow DOM rendering to finish.
	// Avoids flicker on slower devices.
	setTimeout(function() {
   	// allow the screen to dim when returning from the served app
   	window.plugins.insomnia.allowSleepAgain();
   	navigator.splashscreen.hide();
	});
});


var access_token;
var apps = {};

// events

$("#login-form").on('submit', login);

$("input[value='CONNECT']").on('click', function(e) {
	e.preventDefault();
	window.location.href='connect.html'; 
	return false;
});

$('.back').click(function() {
	var cur = $('.view:not(.hidden)'),
			prev = cur.prev('.view');
	if (!!prev.length) {
		cur.addClass('hidden');
		prev.removeClass('hidden');
	}
});

// rendering

function showView(sel) {
	$('.view').addClass('hidden');
	$(sel).removeClass('hidden');
}

function getApps(access_token) {
	$.ajax({
	  dataType: "json",
	  url:"https://build.phonegap.com/api/v1/apps?access_token=" + access_token,
	  success: function(data) {
	  	saveApps(data.apps);
	  	renderApps(data.apps);
	  }
	});
}

function saveApps(appArray) {
	appArray.forEach(function(app) {
		apps[app.id] = app;
	});
}

function renderApps(appArray) {
	var list = $(".apps ul").html("");

	appArray.forEach(function(app) {
		var img_url = "https://build.phonegap.com/api/v1/apps/" + app.id + "/icon?access_token=" + access_token;
		list.append("<li style='background-image: url(\"" + img_url + "\")'>" + 
			"<a href='#' data-id='" + app.id + "'>" + app.title + "</a></li>");
	});

	list.find('a').click(renderApp);
  showView('.apps');
}

function renderApp() {
	var app = apps[$(this).attr("data-id")],
			html = "<h2>" + app.title + "</h2><table>";

	html += "<tr><td>Description</td><td>" + app.description + "</td></tr>";
	html += "<tr><td>Phonegap</td><td>" + app.phonegap_version + "</td></tr>";
	html += "<tr><td>Version</td><td>" + app.version + "</td></tr>";
	if (app.repo)
		html += "<tr><td>Repo</td><td><a class='link' href='#'>" + app.repo + "</a></td></tr>";
	html += "</table>";
	html += "<div class='btns'><input type='button' class='install' value='Install' data-id='" + app.id + "'/><br/>";
	html += "<input type='button' class='run' value='Run' data-id='" + app.id + "'/></div>";

	$('.app .detail').html(html)
  $('.app input.install').click(install);
  $('.app input.run').click(run);
  $('.app a.link').click(browse);

  showView('.app');
}

// controller stuff

function login(e) {
	e.preventDefault();

	var email = $(this).find("#email").val(),
			pass = $(this).find("#password").val();

	PhonegapBuildOauth.login(email, pass, function(a) {
		access_token = a.access_token;
		getApps(a.access_token);
	}, function(a) {
		console.log("Auth failure: " + a.message);
		alert('login failed');
	});
}

function browse() {
	var url = $(this).text();
	window.open(url, '_system');
}

function install() {
	var id = $(this).attr("data-id"),
			download_url = "https://build.phonegap.com/apps/" + id + 
			"/download/" + device.platform.toLowerCase() + "?access_token=" + access_token;
	window.open(download_url, "_system");
}

function run() {
	var app_id = $(this).attr("data-id");
	console.log('running app ' + app_id);
	getUrl(app_id);
}

function getUrl(app_id) {
	$.ajax({
	  dataType: "json",
	  url:"https://build.phonegap.com/api/v1/apps/" + app_id + "/www?access_token=" + access_token,
	  success: function(data) {
	  	navigator.apploader.fetch(decodeURI(data.www_url), function(d) {
	  		if (d.state == 'complete') {
	  			console.log('fetch complete');
		  		navigator.apploader.load(function() {
		  			console.log('Failed to load app.');
		  		});
		  	} else {
	        console.log(Math.round(d.status) + '%');
	      }
	  	}, function() {
	  		console.log('Failed to fetch app.');
	  	});
	  }
	});
}

})();