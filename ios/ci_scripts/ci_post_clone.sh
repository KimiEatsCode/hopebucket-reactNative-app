#!/bin/sh
set -e

# Add all common tool locations for Xcode Cloud (Apple Silicon + Intel Homebrew, nvm, system)
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Node may be managed by nvm — source it if present
if [ -f "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh"
fi

echo "--- PATH: $PATH"
echo "--- node: $(which node || echo 'NOT FOUND')"
echo "--- npm:  $(which npm  || echo 'NOT FOUND')"
echo "--- pod:  $(which pod  || echo 'NOT FOUND')"
echo "--- Node version: $(node --version 2>/dev/null || echo 'N/A')"
echo "--- pod version:  $(pod  --version 2>/dev/null || echo 'N/A')"

# Install Node dependencies (required by React Native native modules at build time)
cd $CI_PRIMARY_REPOSITORY_PATH
npm install

# Restore CocoaPods dependencies (Pods/ is gitignored and must be reinstalled on each build)
cd ios
pod install
