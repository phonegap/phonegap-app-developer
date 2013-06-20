/*---------------------------------------------------
    General
---------------------------------------------------*/

$().ready(function() {

    // Add Events
    $('#login-form').submit(buildSubmit);


    setTimeout( function() {
        $('.alert').removeClass('alert');
        $('.visor').removeClass('pulse');
        $('.visor label').html('Hi!');
        $('.visor .eye').removeClass('faded');
    }, 2000);

    setTimeout( openBot, 2750);
    setTimeout( function() {
        $('.visor .eye').addClass('hidden');
    }, 3300 );

});


/*---------------------------------------------------
    UI - General
---------------------------------------------------*/

function openBot() {
    $('.monitor form').removeClass('hidden');
    setTimeout( function() {
        $('.panel.top').addClass('open');
        $('.visor').addClass('fade-out');
        $('.monitor form').removeClass('faded');
        setTimeout( function() {
            $('.visor').addClass('hidden');
        }, 550);
    }, 50);
}

function closeBot() {
    $('.visor').removeClass('hidden');
    setTimeout( function() {
        $('.panel.top').removeClass('open');
        $('.visor').removeClass('fade-out');
        $('.monitor form').addClass('faded');
        setTimeout( function() {
            $('.monitor form').addClass('hidden')
        }, 550);
    }, 50);
}


// Note that the bot needs to be closed to be able to view this
function updateMessage( msg ) {
    $('.visor').removeClass('pulse');
    $('.visor label').html( msg.toUpperCase() );
}

function errorMessage( msg ) {
    updateMessage( msg );
    $('.visor').removeClass('pulse');
    $('.monitor').addClass('alert');
}

function pulsingMessage( msg ) {
    updateMessage( msg );
    $('.visor').addClass('pulse');
}


/*---------------------------------------------------
    UI - Form
---------------------------------------------------*/

function buildSubmit() {
    closeBot();
    updateMessage('');
    setTimeout(function() {
        pulsingMessage( 'Signing in...' );
    }, 500);

    // Placeholder
    setTimeout(onBuildSubmitError,2000);
    return false;
}

function onBuildSubmitSuccess() {
    updateMessage( 'Success!' );
    setTimeout( function() {
        // Proceed to next step
    }, 1000 );
}

function onBuildSubmitError() {
    errorMessage( 'Error!' );
    setTimeout( function() {
        $('.monitor').removeClass('alert');
        updateMessage('');
        openBot();
    }, 1000 );
}


