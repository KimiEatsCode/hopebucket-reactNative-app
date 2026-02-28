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

// Components
import Bucket from "./src/components/Bucket";
import NavBar from "./src/components/NavBar";
import ListModal from "./src/components/ListModal";

import { COLORS, FONTS, SIZES } from "./src/styles/theme";

function AppContent() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    BagelFatOneRegular: require("./src/fonts/BagelFatOne-Regular.ttf"),
    Cabin_400Regular,
    Cabin_700Bold,
    Roboto_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ExpContextProvider>
      <ListContextProvider>
        <ModalContextProvider>
          <QuoteContextProvider>
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
              </View>
            </SafeAreaView>
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
