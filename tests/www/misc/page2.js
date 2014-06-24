setTimeout(function() {
    console.log('loading iframe after timeout.');
    document.querySelector('#apacheiframe').src = 'http://apache.org';
}, 2000);
document.addEventListener("deviceready", function() {
    document.getElementById('info').textContent += '\nDevice is ready.';
}, false);

window.onload = function() {
  addListenerToClass('backBtn', backHome);
  init();
}
