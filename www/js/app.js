/*---------------------------------------------------
    General
---------------------------------------------------*/

$().ready(function() {

    // Add Events
    $('#build form').submit(buildSubmit);


    setTimeout( function() {
        $('.lock').removeClass('locked');
    }, 500);

    setTimeout( function() {
        $('.core').addClass('unlocked');
    }, 900);

    setTimeout( function() {
        $('.shutter').removeClass('closed');
    }, 1250);

    setTimeout( function() {
        // $('.shutter').remove();
    }, 1750);
});


/*---------------------------------------------------
    UI - General
---------------------------------------------------*/

function showSpinnerModal(label) {
    var el = $('<dialog>')
        .append($('<figure>', {'class':'icon-spinner'}))
        .append($('<label>', {text:label}));
    $('body').append(el);
    setTimeout(function() {
        el.css({opacity:1});
    }, 50);

    // For demo purpose, hide after 2 seconds
    setTimeout(function() {
        hideSpinnerModal();
    }, 2000);
}

function hideSpinnerModal() {
    $('dialog').css({opacity:0})
    setTimeout(function() {
        $('dialog').remove();
    }, 500);
}


/*---------------------------------------------------
    UI - Form
---------------------------------------------------*/

function buildSubmit() {
    showSpinnerModal('Signing in');
    return false;
}


