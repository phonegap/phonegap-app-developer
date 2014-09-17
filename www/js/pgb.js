(function() {
 
$(document).on('deviceready', function() {
	// Add slight delay to allow DOM rendering to finish.
	// Avoids flicker on slower devices.
	addListeners();

	setTimeout(function() {
   	// allow the screen to dim when returning from the served app
   	window.plugins.insomnia.allowSleepAgain();
   	navigator.splashscreen.hide();
	});
});

var access_token;
var apps = {};

// events

function addListeners() {

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

}


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
	var html = "";

	$.get('templates/app-li.html', function(template) {

		$(".apps ul")
			.html(Mustache.render(template, { apps: appArray, access_token: access_token }))
			.find('a').click(renderApp);
  	showView('.apps');

	});

}

function renderApp() {
	var app = apps[$(this).attr("data-id")];

	$.get('templates/app-view.html', function(template) {

    $('.app .detail').html(Mustache.render(template, app));
	  $('.app input.install').click(install);
	  $('.app input.run').click(run);
	  $('.app a.link').click(browse);

	  showView('.app');
	  comparePlugins(app.id);
  });

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

function getPlugins(app_id, callback) {
	$.ajax({
	  dataType: "json",
	  url:"https://build.phonegap.com/api/v1/apps/" + app_id + "/plugins?access_token=" + access_token,
	  success: function(data) {

	  	if (data.length) {

	  		var app_plugins = data;
	  		var available_plugins = cordova.require('cordova/plugin_list').metadata;

	  		callback(app_plugins, available_plugins);

	  		app_plugins.forEach(function(plugin) {
	  			if (typeof available_plugins[plugin.name] == 'undefined') {
	  				console.log(plugin.name + " unavailable");
	  			} else if (available_plugins[plugin.name] != plugin.version) {
	  				console.log(plugin.name + " version mismatch (" + available_plugins[plugin.name] + " vs " + plugin.version + ")");
	  			}
	  		});

	  	}

	  }
	});

}

})();