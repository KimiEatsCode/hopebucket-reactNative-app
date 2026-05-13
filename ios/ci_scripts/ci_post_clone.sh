#!/bin/sh
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Node.js is not pre-installed in Xcode Cloud — install it via Homebrew
brew install node

echo "--- Node version: $(node --version)"
echo "--- npm version:  $(npm --version)"
echo "--- pod version:  $(pod --version)"

# Install Node dependencies (required by React Native native modules at build time)
cd $CI_PRIMARY_REPOSITORY_PATH
npm install

# Restore CocoaPods dependencies (Pods/ is gitignored and must be reinstalled on each build)
cd ios
pod install
