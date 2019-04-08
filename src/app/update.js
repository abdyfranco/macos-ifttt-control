/**
 * Backend script.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

/**
 * Frontend script.
 */
(function (){
    /*!
     * Update application
     */
    $(document.body).on('click', '.btn.update', function() {
        // Show loading spinner
        $('#loading_spinner').fadeIn();
        $('.btn.update').removeClass('update').addClass('disabled');

        // Execute update script
        var update_script = path.join(__dirname, './cli/update.php');
        exec('php ' + update_script, function (error, stdout, stderr) {
            console.log(stdout);
            window.location.replace('index.html');
        });
    });
})(window);
