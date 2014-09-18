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

	  analyzePlugins(app.id, function(res) {
	  	$.extend(app, res);
	  	$.extend(app, { 
	  		pg_version_mismatch: cordova.version != app.phonegap_version,
	  		pg_version: cordova.version
	  	});

	    $('.app .detail').html(Mustache.render(template, app));
		  $('.app input.install').click(install);
		  $('.app input.run').click(run);
		  $('.app a.link').click(browse);
		  $('.app a.show-details').click(function() { $('.app-plugins').toggle() });

		  showView('.app');
	  });
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
	var id = $(this).attr("data-id");
	window.open(apps[id].install_url, "_system");
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

function analyzePlugins(app_id, callback) {
	$.ajax({
	  dataType: "json",
	  url:"https://build.phonegap.com/api/v1/apps/" + app_id + "/plugins?access_token=" + access_token,
	  success: function(data) {

	  	if (typeof data.plugins != 'undefined') {

	  		var available_plugins = cordova.require('cordova/plugin_list').metadata;

	  		var return_obj = {
	  			plugins: data.plugins,
	  			plugin_missing: false,
	  			plugin_mismatch: false
	  		}

	  		return_obj.plugins.forEach(function(plugin) {
	  			plugin.available_version = available_plugins[plugin.name]
	  			if (typeof available_plugins[plugin.name] == 'undefined') {
	  				return_obj.plugin_missing = plugin.mismatch = true;
	  			} else if (available_plugins[plugin.name] != plugin.version) {
	  				return_obj.plugin_mismatch = plugin.mismatch = true;
	  			}
	  			return plugin;
	  		});

	  		console.log(return_obj);

	  		callback(return_obj);
	  	}

	  }
	});

}

})();