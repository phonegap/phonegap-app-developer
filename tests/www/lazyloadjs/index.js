function init() {
    document.addEventListener("deviceready", function() {
        console.log("Device="+device.platform+" "+device.version);
        document.getElementById('info').innerHTML = 'Cordova loaded just fine.';
    }, false);
    window.setTimeout(function() {
        var s = document.createElement('script');
        s.src = cordovaPath;
        document.body.appendChild(s);
    }, 0);
}

window.onload = function() {
  addListenerToClass('backBtn', backHome);
  init();
}
