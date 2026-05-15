#!/bin/sh
set -e

export HOMEBREW_NO_INSTALL_CLEANUP=1
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo "=== [1/3] Installing Node.js ==="
brew install node
echo "Node: $(node --version) | npm: $(npm --version) | pod: $(pod --version)"

echo "=== [2/3] Installing npm dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

echo "=== [3/3] Installing CocoaPods dependencies ==="
cd ios
pod install

echo "=== Done ==="
