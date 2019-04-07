// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Define constants
window.config_file = '../../../../config.php';
window.install_file = '../../../../install';

// Load jQuery and Bootstrap
window.$ = window.jQuery = require('jquery');
window.Bootstrap = require('bootstrap');

// Support for external links
$('body').on('click', 'a.external-link', (event) => {
    event.preventDefault();
    let link = event.target.href;
    require('electron').shell.openExternal(link);
});
