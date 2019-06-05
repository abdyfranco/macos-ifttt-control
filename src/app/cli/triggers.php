<?php
// Get triggers control
$control = file_get_contents(APPDIR . 'assets' . DS . 'json' . DS . 'triggers_control.json');
$control = json_decode($control);

foreach ($webhooks as $webhook_command => $webhooks_url) {
    if (strpos($webhook_command, 'auto-') !== false) {
        // Execute auto-battery webhooks
        if ($webhook_command == 'auto-battery') {
            $status_command = ROOTWEBDIR . 'vendors' . DS . 'm-cli-master' . DS . 'm battery status';
            $status_response = shell_exec($status_command);

            // Get battery percentage
            if (strpos($status_response, '%') !== false) {
                $battery_percentage = (array) explode('%', $status_response, 2);

                if (isset($battery_percentage[0]) && !empty($battery_percentage[0])) {
                    $battery_percentage = (array) explode(' ', trim($battery_percentage[0]));
                    $battery_percentage = end($battery_percentage);
                    $battery_percentage = (array) explode(')', trim($battery_percentage));
                    $battery_percentage = (int) end($battery_percentage);

                    if ($battery_percentage <= 0 || empty($battery_percentage)) {
                        $battery_percentage = 0;
                    }
                } else {
                    $battery_percentage = 0;
                }
            } else {
                $battery_percentage = null;
            }

            // Check if the event can be triggered
            $battery_threshold = 20;
            $battery_percentage = 15;
            if ($battery_percentage !== $battery_threshold) {
                if ($battery_percentage <= $battery_threshold && $control->{'auto-battery'} > $battery_threshold) {
                    $control->{'auto-battery'} = $battery_percentage - 1;

                    // Trigger all the webhooks
                    foreach ($webhooks_url as $trigger) {
                        // Log webhook trigger
                        $log = 'Automatic Webhook Trigger: ' . $trigger->url . ' - Action: ' . $trigger->command . ' - Status: ' . $battery_percentage . "\n";
                        file_put_contents(ROOTWEBDIR . 'commands.log', $log, FILE_APPEND);
                        echo $log;

                        // Trigger webhook
                        $parameters = [
                            'value1' => $trigger->command, // Executed action
                            'value2' => $battery_percentage, // Parsed status
                            'value3' => $status_response // Raw status
                        ];

                        @file_get_contents($trigger->url . (strpos($trigger->url, '?') !== false ? '&' . http_build_query($parameters) : '?' . http_build_query($parameters)));
                    }
                } else if ($battery_percentage >= $battery_threshold && $control->{'auto-battery'} < $battery_threshold) {
                    // The battery is not more under the threshold
                    $control->{'auto-battery'} = $battery_percentage + 1;
                }
            }

            unset($log);
            unset($parameters);
            unset($trigger);
            unset($battery_percentage);
            unset($status_response);
            unset($status_command);
        }

        // Execute auto-bluetooth-off webhooks
        if ($webhook_command == 'auto-bluetooth-off') {
            $status_command = ROOTWEBDIR . 'vendors' . DS . 'm-cli-master' . DS . 'm bluetooth status';
            $status_response = shell_exec($status_command);

            // Get bluetooth status
            $bluetooth_status = trim(str_replace('Bluetooth:', '', $status_response));
            $bluetooth_status = ($bluetooth_status == 'ON' || $bluetooth_status == 'OFF') ? $bluetooth_status : 'OFF';

            // Check if the event can be triggered
            if ($bluetooth_status == 'OFF' && $control->{'auto-bluetooth-off'} == false) {
                $control->{'auto-bluetooth-off'} = true;

                // Trigger all the webhooks
                foreach ($webhooks_url as $trigger) {
                    // Log webhook trigger
                    $log = 'Automatic Webhook Trigger: ' . $trigger->url . ' - Action: ' . $trigger->command . ' - Status: ' . $bluetooth_status . "\n";
                    file_put_contents(ROOTWEBDIR . 'commands.log', $log, FILE_APPEND);
                    echo $log;

                    // Trigger webhook
                    $parameters = [
                        'value1' => $trigger->command, // Executed action
                        'value2' => $bluetooth_status, // Parsed status
                        'value3' => $status_response // Raw status
                    ];

                    @file_get_contents($trigger->url . (strpos($trigger->url, '?') !== false ? '&' . http_build_query($parameters) : '?' . http_build_query($parameters)));
                }
            } else if ($bluetooth_status == 'ON' && $control->{'auto-bluetooth-off'} == true) {
                // The bluetooth has been turned on again
                $control->{'auto-bluetooth-off'} = false;
            }

            unset($log);
            unset($parameters);
            unset($trigger);
            unset($bluetooth_status);
            unset($status_response);
            unset($status_command);
        }

        // Execute auto-bluetooth-on webhooks
        if ($webhook_command == 'auto-bluetooth-on') {
            $status_command = ROOTWEBDIR . 'vendors' . DS . 'm-cli-master' . DS . 'm bluetooth status';
            $status_response = shell_exec($status_command);

            // Get bluetooth status
            $bluetooth_status = trim(str_replace('Bluetooth:', '', $status_response));
            $bluetooth_status = ($bluetooth_status == 'ON' || $bluetooth_status == 'OFF') ? $bluetooth_status : 'OFF';

            // Check if the event can be triggered
            if ($bluetooth_status == 'ON' && $control->{'auto-bluetooth-on'} == false) {
                $control->{'auto-bluetooth-on'} = true;

                // Trigger all the webhooks
                foreach ($webhooks_url as $trigger) {
                    // Log webhook trigger
                    $log = 'Automatic Webhook Trigger: ' . $trigger->url . ' - Action: ' . $trigger->command . ' - Status: ' . $bluetooth_status . "\n";
                    file_put_contents(ROOTWEBDIR . 'commands.log', $log, FILE_APPEND);
                    echo $log;

                    // Trigger webhook
                    $parameters = [
                        'value1' => $trigger->command, // Executed action
                        'value2' => $bluetooth_status, // Parsed status
                        'value3' => $status_response // Raw status
                    ];

                    @file_get_contents($trigger->url . (strpos($trigger->url, '?') !== false ? '&' . http_build_query($parameters) : '?' . http_build_query($parameters)));
                }
            } else if ($bluetooth_status == 'OFF' && $control->{'auto-bluetooth-on'} == true) {
                // The bluetooth has been turned on again
                $control->{'auto-bluetooth-on'} = false;
            }

            unset($log);
            unset($parameters);
            unset($trigger);
            unset($bluetooth_status);
            unset($status_response);
            unset($status_command);
        }
    }
}

// Update control file
$control = json_encode($control);
file_put_contents(APPDIR . 'assets' . DS . 'json' . DS . 'triggers_control.json', $control);

unset($control);
unset($webhook_command);
unset($webhooks_url);
