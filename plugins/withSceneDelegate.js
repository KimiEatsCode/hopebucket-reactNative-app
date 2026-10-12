const { withAppDelegate, withInfoPlist } = require("expo/config-plugins");

// The iOS 27 SDK asserts at launch unless the app adopts the UIScene life cycle.
// Expo SDK 57 ships `ExpoAppSceneDelegate`, but its prebuild template still uses the
// app-delegate life cycle. This mirrors the scene-based template from Expo SDK 58.

const SCENE_DELEGATE = `@objc(SceneDelegate)
class SceneDelegate: ExpoAppSceneDelegate {
  // Extension point for config plugins.
}

`;

const START_REACT_NATIVE = /#if os\(iOS\) \|\| os\(tvOS\)\n\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\n\s*factory\.startReactNative\([\s\S]*?\)\n#endif\n\n/;

function withSceneAppDelegate(config) {
  return withAppDelegate(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes("ExpoReactNativeFactoryProvider")) {
      contents = contents.replace(
        "class AppDelegate: ExpoAppDelegate {",
        "class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {"
      );
    }

    contents = contents.replace(
      START_REACT_NATIVE,
      "    // The window is created and React Native is started by `SceneDelegate`.\n"
    );

    if (!contents.includes("class SceneDelegate")) {
      contents = contents.replace(
        "class ReactNativeDelegate:",
        `${SCENE_DELEGATE}class ReactNativeDelegate:`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

function withSceneManifest(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: "Default Configuration",
            UISceneDelegateClassName: "$(PRODUCT_MODULE_NAME).SceneDelegate",
          },
        ],
      },
    };
    return config;
  });
}

module.exports = function withSceneDelegate(config) {
  return withSceneManifest(withSceneAppDelegate(config));
};
