console.log('Changing hash #1.');
if (location.search.indexOf('hash1') != -1) {
  location.hash = 'a';
} else if (location.search.indexOf('hash2') != -1) {
  location.replace('#replaced');
}
var hashCount = 0;
function changeHash() {
  hashCount += 1;
  if (hashCount % 1) {
    location.hash = hashCount;
  } else {
    location.replace('#' + hashCount);
  }
}
if (location.search.indexOf('changeURL') != -1) {
  history.replaceState(null, null, 'fakepage.html');
}
function loadFrame() {
  var ifr = document.createElement('iframe');
  ifr.src="data:text/html;base64,PGh0bWw+";
  document.body.appendChild(ifr);
}
function reload() {
  // Test that iOS CDVWebViewDelegate doesn't ignore changes when URL doesn't change.
  location.reload();
}
