#!/bin/sh
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo "=== [1/4] Installing Node.js ==="
# Install node if not already present; upgrade if it is
if command -v node >/dev/null 2>&1; then
  echo "Node already available: $(node --version)"
else
  brew install node
fi

echo "=== Node version: $(node --version) ==="
echo "=== npm version:  $(npm --version) ==="
echo "=== pod version:  $(pod --version) ==="

echo "=== [2/4] Installing npm dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

echo "=== [3/4] Installing CocoaPods dependencies ==="
cd ios
pod install --repo-update

echo "=== [4/4] Done ==="
