import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Cabin_400Regular, Cabin_700Bold } from "@expo-google-fonts/cabin";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";

// Context providers
import { ExpContextProvider } from "./src/contexts/ExpContext";
import { ListContextProvider } from "./src/contexts/ListContext";
import { ModalContextProvider } from "./src/contexts/ModalContext";
import { QuoteContextProvider } from "./src/contexts/QuoteContext";
import { ValuesContextProvider } from "./src/contexts/ValuesContext";

// Components
import Bucket from "./src/components/Bucket";
import NavBar from "./src/components/NavBar";
import ListModal from "./src/components/ListModal";
import QuoteModal from "./src/components/QuoteModal";
import WelcomeModal from "./src/components/WelcomeModal";
import { getActiveStoreShotModals, getStoreShot } from "./src/storeScreenshots";

// Hooks
import { useAsyncStorage } from "./src/hooks/useAsyncStorage";

import { COLORS, FONTS, SIZES } from "./src/styles/theme";

function AppContent() {
  const insets = useSafeAreaInsets();
  const storeShot = getStoreShot();
  const storeShotModals = getActiveStoreShotModals();
  const [hasSeenWelcome, setHasSeenWelcome, welcomeLoaded] = useAsyncStorage("hasSeenWelcome", false);
  const [fontsLoaded] = useFonts({
    BagelFatOneRegular: require("./src/fonts/BagelFatOne-Regular.ttf"),
    Cabin_400Regular,
    Cabin_700Bold,
    Roboto_400Regular,
  });

  if (!fontsLoaded || !welcomeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const showWelcome = storeShot.enabled
    ? storeShot.scene === "welcome"
    : welcomeLoaded && !hasSeenWelcome;

  return (
    <ExpContextProvider key={`exp-${storeShot.scene || "live"}`}>
      <ListContextProvider key={`list-${storeShot.scene || "live"}`}>
        <ModalContextProvider key={`modal-${storeShot.scene || "live"}`}>
          <QuoteContextProvider key={`quote-${storeShot.scene || "live"}`}>
            <ValuesContextProvider key={`values-${storeShot.scene || "live"}`}>
              <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
                <View
                  style={[
                    styles.container,
                    { paddingTop: 10 },
                  ]}
                >
                  {/* Logo */}
                  <Text style={styles.logoName}>HopeBucket</Text>

                  {/* Main Bucket Screen */}
                  <Bucket />

                  {/* List Modal (hidden until toggled) */}
                  <ListModal />

                  {/* Bottom Navigation */}
                  <NavBar />

                  {storeShotModals.showQuoteModal ? (
                    <QuoteModal visible onClose={() => {}} />
                  ) : null}

                  {/* Welcome modal — shown on first launch only */}
                  <WelcomeModal
                    visible={showWelcome}
                    onClose={() => setHasSeenWelcome(true)}
                  />
                </View>
              </SafeAreaView>
            </ValuesContextProvider>
          </QuoteContextProvider>
        </ModalContextProvider>
      </ListContextProvider>
    </ExpContextProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoName: {
    fontFamily: FONTS.logo,
    fontWeight: "700",
    fontSize: SIZES.logoFont,
    textAlign: "center",
    color: COLORS.primary,

  },
});
