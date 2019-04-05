#!/bin/bash

# Get current working directory
BASEDIR=$(dirname "$0")

if [ "$BASEDIR" == "." ]; then
   BASEDIR=$(pwd)
fi

mkdir "$BASEDIR/vendors";

# Download rgcr/m-cli
clear;
echo "o------------------------------------------------------------------o";
echo "| macOS IFTTT Control Updater                                 v1.0 |";
echo "o------------------------------------------------------------------o";
echo "|                                                                  |";
echo "|   Upgrading rgcr/m-cli from GitHub...                            |";
echo "|                                                                  |";
echo "o------------------------------------------------------------------o";

cd $BASEDIR
curl -O https://codeload.github.com/rgcr/m-cli/zip/master >/dev/null 2>&1
mv "$BASEDIR/master" "$BASEDIR/master.zip" >/dev/null 2>&1
unzip "$BASEDIR/master.zip" >/dev/null 2>&1
rm -rf "$BASEDIR/master.zip" >/dev/null 2>&1

# Check if M-CLI has been downloaded succesfully
if [ ! -d "$BASEDIR/m-cli-master" ] 
then
    clear;
    echo "o------------------------------------------------------------------o";
    echo "| macOS IFTTT Control Updater                                 v1.0 |";
    echo "o------------------------------------------------------------------o";
    echo "|                                                                  |";
    echo "|   The required files can't be downloaded: rgcr/m-cli             |";
    echo "|                                                                  |";
    echo "|   Please check your internet connection.                         |";
    echo "|                                                                  |";
    echo "o------------------------------------------------------------------o";
    exit;
fi

# Replace old files with the new ones
rm -rf "$BASEDIR/vendors/m-cli-master" >/dev/null 2>&1
mv "$BASEDIR/m-cli-master" "$BASEDIR/vendors/m-cli-master" >/dev/null 2>&1
cp $BASEDIR/plugins/* "$BASEDIR/vendors/m-cli-master/plugins" >/dev/null 2>&1

# Download main service
clear;
echo "o------------------------------------------------------------------o";
echo "| macOS IFTTT Control Updater                                 v1.0 |";
echo "o------------------------------------------------------------------o";
echo "|                                                                  |";
echo "|   Upgrading macOS IFTTT Control Service...                       |";
echo "|                                                                  |";
echo "o------------------------------------------------------------------o";

cd $BASEDIR
curl -O https://raw.githubusercontent.com/abdyfranco/macos-ifttt-control/master/src/macOSIFTTTControl/service.php >/dev/null 2>&1
