#!/bin/bash

# Set terminal color
printf "\033[1;36;48m" ; clear

# Get current working directory
BASEDIR=$(dirname "$0")

if [ "$BASEDIR" == "." ]; then
   BASEDIR=$(pwd)
fi

# Get the app version
VERSION="$($BASEDIR/package version)"

# Make build dir
echo '=> Make sure you already run the "sudo npm install electron-packager -g" command before.';
rm -rf "$BASEDIR/../build" >/dev/null 2>&1
mkdir "$BASEDIR/../build" >/dev/null 2>&1

# Build CLI service
echo "=> Building CLI service v$VERSION ...";
(cd "$BASEDIR/app/cli" && ./install_dependencies)

# Build electron app
echo "=> Building electron app v$VERSION ...";
(cd "$BASEDIR/app" && npm install)
rm -rf "$BASEDIR/app/macOS IFTTT Control-mas-x64" >/dev/null 2>&1
(cd "$BASEDIR/app" && electron-packager "$BASEDIR/app" "macOS IFTTT Control" --overwrite --platform=mas --arch=x64)
cp -r "$BASEDIR/app/macOS IFTTT Control-mas-x64/macOS IFTTT Control.app" "$BASEDIR/../build" >/dev/null 2>&1
rm -rf "$BASEDIR/../build/macOS IFTTT Control.app/Contents/Resources/electron.icns" >/dev/null 2>&1
cp -r "$BASEDIR/app/electron.icns" "$BASEDIR/../build/macOS IFTTT Control.app/Contents/Resources/" >/dev/null 2>&1
mv "$BASEDIR/../build/macOS IFTTT Control.app" "$BASEDIR/../build/macOSIFTTTControl.app" >/dev/null 2>&1

# Cleaning environment
echo '=> Cleaning environment...';
rm -rf "$BASEDIR/app/macOS IFTTT Control-mas-x64" >/dev/null 2>&1
rm -rf "$BASEDIR/app/cli/vendors" >/dev/null 2>&1
