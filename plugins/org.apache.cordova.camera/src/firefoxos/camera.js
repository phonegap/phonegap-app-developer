
var firefoxos = require('cordova/platform');

function getPicture(cameraSuccess, cameraError, cameraOptions) {
  cameraError = cameraError || function(){};
  var pick = new MozActivity({
    name: "pick",
    data: {
      type: ["image/png", "image/jpg", "image/jpeg"]
    }
  });
  pick.onerror = cameraError;
  pick.onsuccess = function() {
    // image is returned as Blob in this.result.blob
    // we need to call cameraSuccess with url or base64 encoded image
    if (cameraOptions && cameraOptions.destinationType == 0) {
      // TODO: base64
      return;
    }
    if (!cameraOptions || !cameraOptions.destinationTyoe || cameraOptions.destinationType > 0) {
      // url
      return cameraSuccess(window.URL.createObjectURL(this.result.blob));
    }
  };
}
var Camera = {
    takePicture: getPicture,
    cleanup: function(){}
};

firefoxos.registerPlugin('Camera', Camera);

