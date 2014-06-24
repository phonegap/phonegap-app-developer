var deviceReady = false;

//-------------------------------------------------------------------------
// Notifications
//-------------------------------------------------------------------------

var beep = function(){
    navigator.notification.beep(3);
};

var alertDialog = function(message, title, button) {
    console.log("alertDialog()");
    navigator.notification.alert(message,
        function(){
            console.log("Alert dismissed.");
        },
        title, button);
    console.log("After alert");
};

var confirmDialogA = function(message, title, buttons) {
    navigator.notification.confirm(message,
        function(r) {
            if(r===0){
                console.log("Dismissed dialog without making a selection.");
                alert("Dismissed dialog without making a selection.");
            }else{
                console.log("You selected " + r);
                alert("You selected " + (buttons.split(","))[r-1]);
            }
        },
        title,
        buttons);
};

var confirmDialogB = function(message, title, buttons) {
    navigator.notification.confirm(message,
        function(r) {
            if(r===0){
                console.log("Dismissed dialog without making a selection.");
                alert("Dismissed dialog without making a selection.");
            }else{
                console.log("You selected " + r);
                alert("You selected " + buttons[r-1]);
            }
        },
        title,
        buttons);
};

var promptDialog = function(message, title, buttons) {
    navigator.notification.prompt(message,
        function(r) {
            if(r && r.buttonIndex===0){
                var msg = "Dismissed dialog";
                if( r.input1 ){
                    msg+=" with input: " + r.input1
                }
                console.log(msg);
                alert(msg);
            }else{
                console.log("You selected " + r.buttonIndex + " and entered: " + r.input1);
                alert("You selected " + buttons[r.buttonIndex-1] + " and entered: " + r.input1);
            }
        },
        title,
        buttons);
};
/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
            deviceReady = true;
            console.log("Device="+device.platform+" "+device.version);
        }, false);
    window.setTimeout(function() {
        if (!deviceReady) {
            alert("Error: Apache Cordova did not initialize.  Demo will not run correctly.");
        }
    },1000);
}

window.onload = function() {
  addListenerToClass('beep', beep);
  addListenerToClass('alertDialog', alertDialog, 
      ['You pressed alert.', 'Alert Dialog', 'Continue']);
  addListenerToClass('confirmDialogA', confirmDialogA, 
      ['You pressed confirm.', 'Confirm Dialog', 'Yes,No,Maybe']);
  addListenerToClass('confirmDialogB', confirmDialogB,
      ['You pressed confirm.', 'Confirm Dialog', ['Yes', 'No', 'Maybe, Not Sure']]);
  addListenerToClass('promptDialog', promptDialog,
      ['You pressed prompt.', 'Prompt Dialog', ['Yes', 'No', 'Maybe, Not Sure']]);
  addListenerToClass('builtInAlert', alert, 'You pressed alert.');
  addListenerToClass('builtInConfirm', confirm, 'You selected confirm');
  addListenerToClass('builtInPrompt', prompt, ['This is a prompt.', 'Default value']);

  addListenerToClass('backBtn', backHome);
  init();
}
