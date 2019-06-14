<?php

// Include required files
include 'blacklist.php';

// Define constants
define('DS', DIRECTORY_SEPARATOR);
define('ROOTWEBDIR', dirname(__FILE__) . DS);
define('APPDIR', realpath(ROOTWEBDIR . '..' . DS) . DS);

while (true) {
    // Get config file
    $config = file_get_contents($_SERVER['HOME'] . DS . '.mic_config.json');
    $config = (object) json_decode($config);
    $config->public_link = str_replace('https://www.dropbox.com/', 'https://dl.dropboxusercontent.com/', str_replace('?dl=0', '', $config->public_link));

    // Get webhook events
    $webhooks = @file_get_contents($_SERVER['HOME'] . DS . '.mic_events.json');
    $webhooks = json_decode($webhooks);

    foreach ($webhooks as $key => $value) {
        $webhooks[$value->command][] = $value;
        unset($webhooks[$key]);
    }

    // Trigger automatic webhooks
    include 'triggers.php';

    // Get commands history
    $command_history = file_get_contents($config->public_link);
    $command_history = (array) explode("\n", trim($command_history));

    // Generate hashes for all the commands
    $commands = [];
    foreach ($command_history as $command) {
        $key = md5(trim($command));
        $commands[$key] = $command;
        unset($key);
    }

    // Get last command
    $last_command = trim(file_get_contents(ROOTWEBDIR . 'last_command'));

    // Execute commands
    $exex_command = end($commands);
    $exec_hash = key($commands);

    if ($last_command !== $exec_hash && !in_array($exec_hash, $blacklist)) {
        $cli_command = (array) explode('|', trim($exex_command), 2);
        $shell_command = ROOTWEBDIR . 'vendors' . DS . 'm-cli-master' . DS . 'm ' . trim($cli_command[1]);

        // Save last command
        file_put_contents(ROOTWEBDIR . 'last_command', $exec_hash);

        // Log execution
        $log = 'Executing: ' . $shell_command . ' - Hash: ' . $exec_hash . ' - Last Hash: ' . $last_command . "\n";
        file_put_contents(ROOTWEBDIR . 'commands.log', $log, FILE_APPEND);
        echo $log;

        // Execute command
        $response = shell_exec($shell_command);

        // Log response
        $log = $exec_hash . ' Response: ' . $response . "\n";
        file_put_contents(ROOTWEBDIR . 'commands.log', $log, FILE_APPEND);
        echo $log;

        // Trigger Webhook event if exists
        $arguments = (array) explode(' ', $cli_command[1]);
        $action = trim($arguments[0]);

        if (isset($webhooks[$action]) && count($webhooks[$action]) > 0) {
            foreach ($webhooks[$action] as $webhook) {
                // Log webhook event
                $log = 'Webhook Event: ' . $webhook . ' - Action: ' . $action . ' - Arguments: ' . $arguments . "\n";
                file_put_contents(ROOTWEBDIR . 'commands.log', $log, FILE_APPEND);
                echo $log;

                // Call webhook event
                $parameters = [
                    'value1' => $action, // Executed action
                    'value2' => implode(' ', $arguments), // Arguments
                    'value3' => $response // Command response
                ];

                @file_get_contents($webhook->url . (strpos($webhook->url, '?') !== false ? '&' . http_build_query($parameters) : '?' . http_build_query($parameters)));
            }
        }
    }

    // Garbage collector
    unset($key);
    unset($value);
    unset($command_history);
    unset($commands);
    unset($command);
    unset($hash);
    unset($exex_command);
    unset($exec_hash);
    unset($cli_command);
    unset($shell_command);
    unset($arguments);
    unset($action);
    unset($log);
    unset($response);
    unset($last_command);
    unset($webhook);
    unset($webhooks);
    sleep(5);
}
