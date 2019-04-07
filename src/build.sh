#!/bin/bash

# Set terminal color
printf "\033[1;36;48m" ; clear

# Get current working directory
BASEDIR=$(dirname "$0")

if [ "$BASEDIR" == "." ]; then
   BASEDIR=$(pwd)
fi

# Make build dir
echo '=> Make sure you already run the "sudo npm install electron-packager -g" command before.';
rm -rf "$BASEDIR/../build" >/dev/null 2>&1
mkdir -p "$BASEDIR/../build/macOSIFTTTControl" >/dev/null 2>&1

# Build electron app
echo '=> Building electron app...';
rm -rf "$BASEDIR/gui/macOS IFTTT Control-mas-x64" >/dev/null 2>&1
electron-packager "$BASEDIR/gui" "macOS IFTTT Control" --platform=mas --arch=x64 >/dev/null 2>&1
cp -r "$BASEDIR/gui/macOS IFTTT Control-mas-x64/macOS IFTTT Control.app" "$BASEDIR/../build/macOSIFTTTControl" >/dev/null 2>&1
rm -rf "$BASEDIR/gui/macOS IFTTT Control-mas-x64" >/dev/null 2>&1
rm -rf "$BASEDIR/../build/macOSIFTTTControl/macOS IFTTT Control.app/Contents/Resources/electron.icns" >/dev/null 2>&1
cp -r "$BASEDIR/gui/electron.icns" "$BASEDIR/../build/macOSIFTTTControl/macOS IFTTT Control.app/Contents/Resources/" >/dev/null 2>&1

echo '=> Building service...';
cp -r $BASEDIR/macOSIFTTTControl/* "$BASEDIR/../build/macOSIFTTTControl/" >/dev/null 2>&1
$BASEDIR/../build/macOSIFTTTControl/update >/dev/null 2>&1
rm -rf "$BASEDIR/../build/macOSIFTTTControl/update" >/dev/null 2>&1
