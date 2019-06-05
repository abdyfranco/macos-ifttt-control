/**
 * Backend script.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const remote = require('electron').remote;
const request = require("request");

// Get config
let config_file = path.join(process.env.HOME, '/.mic_config.json');
let config_rawdata = fs.readFileSync(config_file);
let config = JSON.parse(config_rawdata);
window.config = config;

// Get icons
let icons_file = path.join(__dirname, './assets/json/icons.json');
let rawdata = fs.readFileSync(icons_file);
let icons = JSON.parse(rawdata);
window.icons = icons;

// Get webhook triggers
let triggers_file = path.join(process.env.HOME, '/.mic_triggers.json');
let triggers_rawdata = fs.readFileSync(triggers_file);
let triggers = JSON.parse(triggers_rawdata);
window.triggers = triggers;

// Get webhook events
let events_file = path.join(process.env.HOME, '/.mic_events.json');
let events_rawdata = fs.readFileSync(events_file);
let events = JSON.parse(events_rawdata);
window.events = events;

function runWebhook(url) {
    $.get(url, function (data, status) {
        if (status == 'success') {
            alertDialog('Webhook Triggered', 'The Webhook has been triggered succesfully.', 'success');
        } else {
            alertDialog('Webhook can\'t be Triggered', 'The Webhook can\'t been triggered at the moment. Try again later.', 'danger');
        }
    });
}

function deleteWebhook(id) {
    let new_triggers = triggers;
    new_triggers.splice(id, 1);

    let json = JSON.stringify(new_triggers);
    fs.writeFile(triggers_file, json, 'utf8', function (event) {
        document.location.reload();
    });
}

function addWebhook() {
    let url = document.getElementById('webhook_url').value;
    let icon = document.getElementById('webhook_icon').value;
    let color = document.getElementById('webhook_color').value;
    let title = document.getElementById('webhook_title').value;

    if (title == '') {
        alert('The Webhook Title can\'t be empty.');
        return;
    }

    if (url == '') {
        alert('The Webhook URL can\'t be empty.');
        return;
    }

    if (!validateUrl(url)) {
        alert('The entered Webhook URL it\'s invalid.');
        return;
    }

    // Add webhook to the json file
    let new_webhook = {
        'icon': icon,
        'color': color,
        'title': title,
        'url': url
    };
    triggers.push(new_webhook);
    let json = JSON.stringify(triggers);
    fs.writeFile(triggers_file, json, 'utf8', function (event) {
        document.location.reload();
    });
}

function addEvent() {
    let url = document.getElementById('event_url').value;
    let command = document.getElementById('event_command').value;

    if (command == '') {
        alert('The Event Command can\'t be empty.');
        return;
    }

    if (url == '') {
        alert('The Event URL can\'t be empty.');
        return;
    }

    if (!validateUrl(url)) {
        alert('The entered Event URL it\'s invalid.');
        return;
    }

    // Add event to the json file
    let new_event = {
        'url': url,
        'command': command
    };
    events.push(new_event);
    let json = JSON.stringify(events);
    fs.writeFile(events_file, json, 'utf8', function (event) {
        document.location.reload();
    });
}

function deleteEvent(id) {
    let new_events = events;
    new_events.splice(id, 1);

    let json = JSON.stringify(new_events);
    fs.writeFile(events_file, json, 'utf8', function (event) {
        document.location.reload();
    });
}

/**
 * Frontend script.
 */
(function () {
    /*!
     * Check for updates
     */
    jQuery(document).ready(function () {
        // Get current version
        let version = remote.app.getVersion();

        // Get remote version
        let package_url = 'https://raw.githubusercontent.com/abdyfranco/macos-ifttt-control/master/src/app/package.json';

        request({
            url: package_url,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                if (version !== body.version) {
                    window.location.replace('update.html');
                }
            }
        });

    });

    /*!
     * Set Mac Hash
     */
    jQuery(document).ready(function () {
        $('#footer #mac_hash').text(config.hash);
    });

    /*!
     * List Font Awesome 5 Icons
     */
    jQuery(document).ready(function () {
        if (typeof icons !== 'undefined' && icons.length > 0) {
            icons.forEach(function (element) {
                if (element[1] == null) {
                    element[1] = 'fas';
                }

                if (element[2] == null) {
                    element[2] = element[0];
                }

                $('#webhook_icons').append('<div class="btn btn-sm btn-info w-px-40 m-2" onclick="$(\'#webhook_icon\').val(\'' + element[1] + ' fa-' + element[2] + '\');"><i class="' + element[1] + ' fa-' + element[2] + ' fs-md"></i></div>');
            });
        }
    });

    /*!
     * List Webhooks
     */
    jQuery(document).ready(function () {
        if (typeof triggers !== 'undefined' && triggers.length > 0) {
            triggers.forEach(function (element, id) {
                $('#webhooks .row').append('<div class="col-3 col-md-2 col-lg-1 pb-4"><div class="btn btn-sm btn-secondary delete-webhook" data-webhook-id="' + id + '"><i class="fas fa-times"></i></div> <div class="btn btn-block btn-sm btn-' + element.color + ' trigger-webhook" data-webhook="' + element.url + '"><i class="' + element.icon + ' fs-lg my-2"></i><br/> ' + element.title + '</div></div>');
            });
        } else {
            $('#webhooks-empty').show();
        }
    });

    /*!
     * Trigger Webhook
     */
    $(document.body).on('click', '.trigger-webhook', function () {
        let webhook = $(this).attr('data-webhook');
        runWebhook(webhook);
    });


    /*!
     * Delete Webhook
     */
    $(document.body).on('click', '.delete-webhook', function () {
        let webhook = $(this).attr('data-webhook-id');
        deleteWebhook(webhook);
    });

    /*!
     * Add Webhook
     */
    $(document.body).on('click', '#submit_add_webhook', function () {
        addWebhook();
    });

    /*!
     * List Events
     */
    jQuery(document).ready(function () {
        if (typeof events !== 'undefined' && events.length > 0) {
            events.forEach(function (element, id) {
                let color = 'info';

                if (element.command.includes('auto-')) {
                    color = 'success';
                }

                $('#events .row').append('<div class="col-12 pb-2"> <div class="btn-group w-100" role="group"> <button type="button" class="btn btn-light btn-block w-75 text-left border border-' + color + ' copy-clipboard">' + element.url + '</button> <button type="button" class="btn btn-' + color + ' text-center w-25">' + element.command + '</button> <button type="button" class="btn btn-secondary text-right delete-event" data-event-id="' + id + '"><i class="fas fa-times"></i></button> </div> </div>');
            });
        } else {
            $('#events-empty').show();
        }
    });

    /*!
     * Delete Event
     */
    $(document.body).on('click', '.delete-event', function () {
        let event = $(this).attr('data-event-id');
        deleteEvent(event);
    });

    /*!
     * Add Event
     */
    $(document.body).on('click', '#submit_add_event', function () {
        addEvent();
    });

    /*!
     * Copy Mac Hash to Clipboard
     */
    $(document.body).on('click', '#mac_hash', function () {
        copyToClipboard('#mac_hash');
        $('#mac_hash_tooltip').fadeIn();
        setTimeout(function () {
            $('#mac_hash_tooltip').fadeOut();
        }, 4000);
    });

    /*!
     * Copy Button Content to Clipboard
     */
    $(document.body).on('click', '.copy-clipboard', function () {
        let text = $(this).text();
        let element = this;

        copyToClipboard(element);
        $(element).html('<i class="fas fa-check"></i> Copied to Clipboard!');
        setTimeout(function () {
            $(element).html(text);
        }, 1500);
    });
})(window);
