/**
 * Backend script.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

/*!
 * Generate Mac Hash
 */
let date = new Date();
let hash = crypto.createHash('md5').update(Math.random() + 'dtm' + date.getTime()).digest('hex');

/**
 * Frontend script.
 */
(function (){
    /*!
     * Install application
     */
    $(document.body).on('click', '.btn.install', function() {
        // Validate Dropbox url
        var dropbox_url = document.getElementById('dropbox_url').value;

        if (!validateUrl(dropbox_url) || !dropbox_url.includes('dropbox.com')) {
            alert('The entered Dropbox URL it\'s invalid.');
            return;
        }

        // Delete hash file
        var desktop_path = path.join(process.env.HOME, '/Desktop');
        fs.unlinkSync(path.join(desktop_path, '/' + hash));

        // Save the config file
        var config_file = path.join(__dirname, './assets/json/config.json');
        var config = {
            'public_link': dropbox_url,
            'hash': hash
        };
        var json = JSON.stringify(config);
        fs.writeFile(config_file, json, function() {
            // Nothing to do
        });

        // Register the service daemon
        var daemon_file = path.join(__dirname, './cli/daemon/co.abdyfran.macosiftttcontrol.plist');
        var library_path = path.join(process.env.HOME, '/Library');
        exec('cp ' + daemon_file + ' ' + library_path + '/LaunchAgents/co.abdyfran.macosiftttcontrol.plist', function (error, stdout, stderr) {
            console.log(stdout);
        });
        exec('launchctl load ' + library_path + '/LaunchAgents/co.abdyfran.macosiftttcontrol.plist', function (error, stdout, stderr) {
            console.log(stdout);
            window.location.replace('index.html');
        });
    });

    /*!
     * Generate Dropbox file
     */
    jQuery(document).ready(function () {
        // Set hash on the inferface
        $('#mac_hash').text(hash);

        // Create the file with the hash as name
        var desktop_path = path.join(process.env.HOME, '/Desktop');
        fs.writeFile(path.join(desktop_path, '/' + hash), '', function() {
            // Nothing to do
        });
    });

})(window);
