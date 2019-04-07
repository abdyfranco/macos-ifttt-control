/**
 * Main application script.
 */

/**
 * Alert dialog function
 */
function alertDialog(title, text, type) {
    document.getElementById('alert-dialog-title').innerHTML = title;
    document.getElementById('alert-dialog-content').innerHTML = text;

    if (type == 'success') {
        $('#alert-dialog-title').addClass('text-info').removeClass('text-danger');
        $('#alert-dialog-icon').addClass('text-info').removeClass('text-danger');
        $('#alert-dialog-icon i').addClass('fa-check-circle').removeClass('fa-times-circle').removeClass('fa-info-circle');
    } else if (type == 'danger') {
        $('#alert-dialog-title').removeClass('text-info').addClass('text-danger');
        $('#alert-dialog-icon').removeClass('text-info').addClass('text-danger');
        $('#alert-dialog-icon i').removeClass('fa-check-circle').addClass('fa-times-circle').removeClass('fa-info-circle');

    } else {
        $('#alert-dialog-title').removeClass('text-info').removeClass('text-danger');
        $('#alert-dialog-icon').removeClass('text-info').removeClass('text-danger');
        $('#alert-dialog-icon i').removeClass('fa-check-circle').removeClass('fa-times-circle').addClass('fa-info-circle');

    }

    $('#alert-dialog').modal('show');
}
