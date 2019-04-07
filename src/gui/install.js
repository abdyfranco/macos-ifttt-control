/**
 * Backend script.
 */
'use strict';

/*!
 * Open installer script
 */
$(document.body).on('click', '.btn.install', function() {
    const shell = require('electron').shell;
    const path = require('path');
    shell.openItem(path.join(__dirname, install_file));

    const remote = require('electron').remote;
    var window = remote.getCurrentWindow();
    window.close();
});