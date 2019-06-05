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
(function () {
    /*!
     * Update application
     */
    $(document.body).on('click', '.btn.update', function () {
        // Show loading spinner
        $('#loading_spinner').fadeIn();
        $('.btn.update').removeClass('update').addClass('disabled');

        // Execute update script
        let update_script = path.join(__dirname, './cli/update.php');
        exec('php ' + update_script, function (error, stdout, stderr) {
            console.log(stdout);

            // Reload the application if the source code it's changed
            require('electron-reload')(__dirname, {
                electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
            });

            setTimeout(function() {
                // Close the application if electron-reload doesn't detect a source change
                remote.app.quit();
            }, 2000);
        });
    });

    /*!
     * Get application version
     */
    jQuery(document).ready(function () {
        // Get current version
        let version = remote.app.getVersion();
        $('#current_version').text(version);

        // Get remote version
        let package_url = 'https://raw.githubusercontent.com/abdyfranco/macos-ifttt-control/master/src/app/package.json';

        request({
            url: package_url,
            json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                $('#new_version').text(body.version);
            }
        });
    });

})(window);
