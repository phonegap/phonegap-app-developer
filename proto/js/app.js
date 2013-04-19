$().ready(function() {

    $('#sync .bt').on('click', onBtSync);
    $('#build .bt').on('click', onBtBuild);
});

function onBtSync() {
    showSection('sync');
}

function onBtBuild() {
    showSection('build');
}

function showSection( type ) {
    $('.enlarge').removeClass('enlarge');
    $('#' + type).addClass('enlarge');

    setTimeout(function() {
        $('#' + type + ' input').first().focus().click();
    }, 200);
}