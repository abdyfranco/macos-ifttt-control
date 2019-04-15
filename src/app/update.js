/**
 * Backend script.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const remote = require('electron').remote;

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
            exec(process.execPath);
            remote.app.quit();
        });
    });

    /*!
     * Get application version
     */
    jQuery(document).ready(function () {
        // Get current version
        var version = remote.app.getVersion();
        $('#current_version').text(version);
        
        // Get remote version
        var package_url = 'https://raw.githubusercontent.com/abdyfranco/macos-ifttt-control/master/src/app/package.json';

        request({
            url: package_url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                $('#new_version').text(body.version);
            }
        });
    });
})(window);
