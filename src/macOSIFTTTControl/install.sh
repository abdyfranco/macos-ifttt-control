#!/bin/bash

# Get current working directory
BASEDIR=$(dirname "$0")

if [ "$BASEDIR" == "." ]; then
   BASEDIR=$(pwd)
fi

mkdir "$BASEDIR/vendors";

# Generate a install hash
HASH=$(php -r "echo md5(time().rand(0,255));";)

# Download rgcr/m-cli
clear;
echo "o------------------------------------------------------------------o";
echo "| macOS IFTTT Control Installer                               v1.0 |";
echo "o------------------------------------------------------------------o";
echo "|                                                                  |";
echo "|   Downloading rgcr/m-cli from GitHub...                          |";
echo "|                                                                  |";
echo "o------------------------------------------------------------------o";

cd $BASEDIR
curl -O https://codeload.github.com/rgcr/m-cli/zip/master >/dev/null 2>&1
mv "$BASEDIR/master" "$BASEDIR/master.zip" >/dev/null 2>&1
unzip "$BASEDIR/master.zip" >/dev/null 2>&1
rm -rf "$BASEDIR/master.zip" >/dev/null 2>&1
mv "$BASEDIR/m-cli-master" "$BASEDIR/vendors/m-cli-master" >/dev/null 2>&1
cp $BASEDIR/plugins/* "$BASEDIR/vendors/m-cli-master/plugins" >/dev/null 2>&1

# Check if M-CLI has been downloaded succesfully
if [ ! -d "$BASEDIR/vendors/m-cli-master" ] 
then
    clear;
    echo "o------------------------------------------------------------------o";
    echo "| macOS IFTTT Control Installer                               v1.0 |";
    echo "o------------------------------------------------------------------o";
    echo "|                                                                  |";
    echo "|   The required files can't be downloaded: rgcr/m-cli             |";
    echo "|                                                                  |";
    echo "|   Please check your internet connection.                         |";
    echo "|                                                                  |";
    echo "o------------------------------------------------------------------o";
    exit;
fi

# Creating hash
clear;
echo "o------------------------------------------------------------------o";
echo "| macOS IFTTT Control Installer                               v1.0 |";
echo "o------------------------------------------------------------------o";
echo "|                                                                  |";
echo "|   macOS IFTTT Control requires dropbox in order to work.         |";
echo "|                                                                  |";
echo "|   Now upload the $HASH file on        |";
echo "|   your DropBox account in the following directory:               |";
echo "|                                                                  |";
echo "|   /macOSIFTTTControl/$HASH            |";
echo "|                                                                  |";
echo "|                                  [X] Press any key to continue   |";
echo "|                                                                  |";
echo "o------------------------------------------------------------------o";
echo "" > "$BASEDIR/$HASH"
read continue;

# Ask for Dropbox link
clear;
echo "o------------------------------------------------------------------o";
echo "| macOS IFTTT Control Installer                               v1.0 |";
echo "o------------------------------------------------------------------o";
echo "|                                                                  |";
echo "|   macOS IFTTT Control requires dropbox in order to work.         |";
echo "|                                                                  |";
echo "|   Once the file has been uploaded, you must publicly share       |";
echo "|   this file using a link.                                        |";
echo "|                                                                  |";
echo "|   Please enter the public shared link:                           |";
echo "|                                                                  |";
echo "o------------------------------------------------------------------o";
read public_link;

rm -rf "$BASEDIR/$HASH"
echo "<?php \$config = ['public_link' => '$public_link', 'hash' => '$HASH'];" > "$BASEDIR/config.php"

# Ask for Dropbox link
clear;
echo "o------------------------------------------------------------------o";
echo "| macOS IFTTT Control Installer                               v1.0 |";
echo "o------------------------------------------------------------------o";
echo "|                                                                  |";
echo "|   You are ready to start using macOS IFTTT Control, remember     |";
echo "|   to save your computer hash on a secure place, since it is      |";
echo "|   necessary for us to be able to identify your Mac in IFTTT.     |";
echo "|                                                                  |";
echo "|   Mac Hash: $HASH                     |";
echo "|                                                                  |";
echo "o------------------------------------------------------------------o";

cp "$BASEDIR/daemon/co.abdyfran.macosiftttcontrol.plist" ~/Library/LaunchAgents/co.abdyfran.macosiftttcontrol.plist
launchctl load ~/Library/LaunchAgents/co.abdyfran.macosiftttcontrol.plist
