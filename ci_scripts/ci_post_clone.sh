#!/bin/sh
set -e

# Install Node dependencies (required by React Native native modules at build time)
cd $CI_PRIMARY_REPOSITORY_PATH
npm install

# Restore CocoaPods dependencies (Pods/ is gitignored and must be reinstalled on each build)
cd ios
pod install
