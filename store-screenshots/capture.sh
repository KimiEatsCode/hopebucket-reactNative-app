#!/bin/bash
set -euo pipefail

UDID="1DAA6683-2CDC-4979-B528-77E4AA32700C"
APP="com.hopebucket.app"
ROOT="/Users/sarahrettig/Documents/GitHub/hopebucket-reactNative-app"
DIR="$ROOT/store-screenshots"
SCENE_FILE="$ROOT/src/storeScreenshots/activeScene.js"

SCENES=(
  "welcome"
  "home-empty"
  "add-hope"
  "home-filling"
  "list"
  "quotes"
  "quote-card"
  "values"
  "home-full"
)

NAMES=(
  "01-welcome"
  "02-home-empty"
  "03-add-hope"
  "04-home-filling"
  "05-list"
  "06-quotes"
  "07-quote-card"
  "08-values"
  "09-home-full"
)

xcrun simctl terminate "$UDID" host.exp.Exponent >/dev/null 2>&1 || true

for i in "${!SCENES[@]}"; do
  scene="${SCENES[$i]}"
  name="${NAMES[$i]}"

  cat > "$SCENE_FILE" <<EOF
// Set enabled to true only when capturing App Store screenshots.
export const STORE_SHOT_ENABLED = true;
export const STORE_SHOT_SCENE = "$scene";
EOF

  xcrun simctl terminate "$UDID" "$APP" >/dev/null 2>&1 || true
  sleep 1.5
  xcrun simctl launch "$UDID" "$APP" >/dev/null

  if [ "$scene" = "home-full" ]; then
    sleep 2.0
  else
    sleep 3.6
  fi

  xcrun simctl status_bar "$UDID" override \
    --time "9:41" \
    --dataNetwork wifi \
    --wifiMode active \
    --wifiBars 3 \
    --cellularMode active \
    --cellularBars 4 \
    --operatorName "" \
    --batteryState charged \
    --batteryLevel 100

  xcrun simctl io "$UDID" screenshot "$DIR/${name}.png" >/dev/null
  echo "captured ${name}.png"
done
