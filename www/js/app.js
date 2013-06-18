/*---------------------------------------------------
    General
---------------------------------------------------*/

$().ready(function() {

    // Add Events
    $('#build form').submit(buildSubmit);


    setTimeout( function() {
        $('.alert').removeClass('alert');
        $('.visor').removeClass('pulse');
        $('.visor label').html('Hi!');
    }, 2000);

    setTimeout( function() {
        $('.panel.top').addClass('open');
        &('.visor').addClass('fade-out');
    }, 2750);

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


