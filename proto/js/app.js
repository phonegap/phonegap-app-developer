/*---------------------------------------------------
    General
---------------------------------------------------*/

$().ready(function() {

    // Add Events
    $('#sync .bt').on('click', openSync);    
    $('#build .bt').on('click', openBuild);

    $('#sync form').submit(syncSubmit);
    $('#build form').submit(buildSubmit);
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
    UI - Accordion
---------------------------------------------------*/

function openSync() {
    openSection('sync');
}

function openBuild() {
    openSection('build');
}

function openSection(type) {
    var isOpen = $('#' + type).hasClass('open');
    $('.open').removeClass('open');

    if (!isOpen) {
        $('#' + type).addClass('open');

        setTimeout(function() {
            $('#' + type + ' input').first().focus().click();
            // This does not work properly on iOS
        }, 200);
    }
}


/*---------------------------------------------------
    UI - Form
---------------------------------------------------*/

function syncSubmit() {
    var ip = $('#sync-ip').attr('value');
    showSpinnerModal('Looking for IP');
    return false;
}

function buildSubmit() {
    showSpinnerModal('Signing in');
    return false;
}


