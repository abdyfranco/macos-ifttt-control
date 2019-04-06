<?php

include 'config.php';

define('DS', DIRECTORY_SEPARATOR);
define('ROOTWEBDIR', dirname(__FILE__) . DS);

// Format DropBox url
$config['public_link'] = str_replace('https://www.dropbox.com/', 'https://dl.dropboxusercontent.com/', str_replace('?dl=0', '', $config['public_link']));

// Hashes blacklist
$blacklist = [
    'd41d8cd98f00b204e9800998ecf8427e'
];

while (true) {
    // Get webhook events
    include 'webhooks.php';

    // Get commands history
    $command_history = file_get_contents($config['public_link']);
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

        // Trigger Webhook if exists
        $arguments = (array) explode(' ', $cli_command[1]);
        $action = trim($arguments[0]);

        if (isset($webhooks[$action]) && strpos($webhooks[$action], 'http') !== false) {
            $parameters = [
                'value1' => $action, // Executed action
                'value2' => implode(' ', $arguments), // Arguments
                'value3' => $response // Command response
            ];

            @file_get_contents($webhooks[$action] . (strpos($webhooks[$action], '?') !== false ? '&' . http_build_query($parameters) : '?' . http_build_query($parameters)));
        }
    }

    // Garbage collector
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
    unset($webhooks);
    sleep(5);
}
