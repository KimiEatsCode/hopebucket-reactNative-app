#!/bin/sh
set -e

# Xcode Cloud runs on Apple Silicon — Homebrew (and pod/node) live under /opt/homebrew
export PATH="/opt/homebrew/bin:$PATH"

echo "--- Node version: $(node --version)"
echo "--- npm version: $(npm --version)"
echo "--- pod version: $(pod --version)"

# Install Node dependencies (required by React Native native modules at build time)
# ci_scripts lives inside ios/, so repo root is one level up
cd $CI_PRIMARY_REPOSITORY_PATH
npm install

# Restore CocoaPods dependencies (Pods/ is gitignored and must be reinstalled on each build)
cd ios
pod install
