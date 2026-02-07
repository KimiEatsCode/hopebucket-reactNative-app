import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import {
  DeliciousHandrawn_400Regular,
} from "@expo-google-fonts/delicious-handrawn";
import { Cabin_400Regular, Cabin_700Bold } from "@expo-google-fonts/cabin";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";

// Context providers
import { ExpContextProvider } from "./src/contexts/ExpContext";
import { ListContextProvider } from "./src/contexts/ListContext";
import { ModalContextProvider } from "./src/contexts/ModalContext";

// Components
import Bucket from "./src/components/Bucket";
import NavBar from "./src/components/NavBar";
import ListModal from "./src/components/ListModal";

import { COLORS, FONTS, SIZES } from "./src/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    DeliciousHandrawn_400Regular,
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
          <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.container}>
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
        </ModalContextProvider>
      </ListContextProvider>
    </ExpContextProvider>
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
    paddingTop: 10,
  },
  logoName: {
    fontFamily: FONTS.logo,
    fontSize: SIZES.logoFont,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
    marginTop: 10,
    marginBottom: 16,
  },
});
