#!/bin/sh
set -e

# Xcode Cloud checks out the repo without node_modules or Pods.
# The Xcode project needs Pods-HopeBucket.release.xcconfig before the build starts.
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1

brew install node cocoapods

cd "$CI_PRIMARY_REPOSITORY_PATH"
npm ci

cd ios
pod install
