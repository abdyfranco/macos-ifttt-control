/**
 * Backend script.
 */
'use strict';

const fs = require('fs');
const path = require('path');

// Get icons
var icons_file = path.join(__dirname, '/assets/json/icons.json');
let rawdata = fs.readFileSync(icons_file);  
let icons = JSON.parse(rawdata);  
window.icons = icons;

// Get webhook triggers
var triggers_file = path.join(__dirname, './assets/json/triggers.json');
let triggers_rawdata = fs.readFileSync(triggers_file);  
let triggers = JSON.parse(triggers_rawdata);  
window.triggers = triggers;

// Get webhook events
var events_file = path.join(__dirname, './assets/json/events.json');
let events_rawdata = fs.readFileSync(events_file);  
let events = JSON.parse(events_rawdata);  
window.events = events;

function validateUrl(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    return !!pattern.test(url);
}

function runWebhook(url)
{
    $.get(url, function(data, status) {
        if (status == 'success') {
            alertDialog('Webhook Triggered', 'The Webhook has been triggered succesfully.', 'success');
        } else {
            alertDialog('Webhook can\'t be Triggered', 'The Webhook can\'t been triggered at the moment. Try again later.', 'danger');
        }
    });
}

function deleteWebhook(id)
{
    var new_triggers = triggers;
    new_triggers.splice(id, 1);

    var json = JSON.stringify(new_triggers);
    fs.writeFile(triggers_file, json, 'utf8', function(event) {
        document.location.reload();
    });
}

function addWebhook()
{
    var url = document.getElementById('webhook_url').value;  
    var icon = document.getElementById('webhook_icon').value;  
    var color = document.getElementById('webhook_color').value;  
    var title = document.getElementById('webhook_title').value;

    if (title == '') {
        alert('The Webhook Title can\'t be empty.');
        return;
    }

    if (url == '') {
        alert('The Webhook URL can\'t be empty.');
        return;
    }

    if (!validateUrl(url)) {
        alert('The entered Webhook URL it\'s invalid');
        return;
    }

    // Add webhook to the json file
    var new_webhook = {
        'icon': icon,
        'color': color,
        'title': title,
        'url': url
    };
    triggers.push(new_webhook);
    var json = JSON.stringify(triggers);
    fs.writeFile(triggers_file, json, 'utf8', function(event) {
        document.location.reload();
    });
}

function addEvent()
{
    var url = document.getElementById('event_url').value;  
    var command = document.getElementById('event_command').value;  

    if (command == '') {
        alert('The Event Command can\'t be empty.');
        return;
    }

    if (url == '') {
        alert('The Event URL can\'t be empty.');
        return;
    }

    if (!validateUrl(url)) {
        alert('The entered Event URL it\'s invalid');
        return;
    }

    // Add event to the json file
    var new_event = {
        'url': url,
        'command': command
    };
    events.push(new_event);
    var json = JSON.stringify(events);
    fs.writeFile(events_file, json, 'utf8', function(event) {
        document.location.reload();
    });
}

function deleteEvent(id)
{
    var new_events = events;
    new_events.splice(id, 1);

    var json = JSON.stringify(new_events);
    fs.writeFile(events_file, json, 'utf8', function(event) {
        document.location.reload();
    });
}

/**
 * Frontend script.
 */
(function (){
    /*!
     * List Font Awesome 5 Icons
     */
    jQuery(document).ready(function () {
        if (typeof icons !== 'undefined' && icons.length > 0) {
            icons.forEach(function(element) {
                if (element[1] == null) {
                    element[1] = 'fas';
                }

                if (element[2] == null) {
                    element[2] = element[0];
                }

                $('#webhook_icons').append('<div class="btn btn-sm btn-info w-px-30 m-1" onclick="$(\'#webhook_icon\').val(\'' + element[1] + ' fa-' + element[2] + '\');"><i class="' + element[1] + ' fa-' + element[2] + '"></i></div>');
            });
        }
    });

    /*!
     * List Webhooks
     */
    jQuery(document).ready(function () {
        if (typeof triggers !== 'undefined' && triggers.length > 0) {
            triggers.forEach(function(element, id) {
                $('#webhooks .row').append('<div class="col-3 col-md-2 col-lg-1"><div class="btn btn-sm btn-secondary delete-webhook" data-webhook-id="' + id + '"><i class="fas fa-times"></i></div> <div class="btn btn-block btn-sm btn-' + element.color + ' trigger-webhook" data-webhook="' + element.url + '"><i class="' + element.icon + ' fs-lg my-2"></i><br/> ' + element.title + '</div></div>');
            });
        } else {
            $('#webhooks-empty').show();
        }
    });

    /*!
     * Trigger Webhook
     */
    $(document.body).on('click', '.trigger-webhook', function() {
        var webhook = $(this).attr('data-webhook');
        runWebhook(webhook);
    });


    /*!
     * Delete Webhook
     */
    $(document.body).on('click', '.delete-webhook', function() {
        var webhook = $(this).attr('data-webhook-id');
        deleteWebhook(webhook);
    });

    /*!
     * Add Webhook
     */
    $(document.body).on('click', '#submit_add_webhook', function() {
        addWebhook();
    });

    /*!
     * List Events
     */
    jQuery(document).ready(function () {
        if (typeof events !== 'undefined' && events.length > 0) {
            events.forEach(function(element, id) {
                $('#events .row').append('<div class="col-12 pb-2"> <div class="btn-group w-100" role="group"> <button type="button" class="btn btn-light btn-block w-100 text-left border border-info">' + element.url + '</button> <button type="button" class="btn btn-info text-right">' + element.command + '</button> <button type="button" class="btn btn-secondary text-right delete-event" data-event-id="' + id + '"><i class="fas fa-times"></i></button> </div> </div>');
            });
        } else {
            $('#events-empty').show();
        }
    });

    /*!
     * Delete Event
     */
    $(document.body).on('click', '.delete-event', function() {
        var event = $(this).attr('data-event-id');
        deleteEvent(event);
    });

    /*!
     * Add Event
     */
    $(document.body).on('click', '#submit_add_event', function() {
        addEvent();
    });
})(window);