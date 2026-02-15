import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { ListContext } from "../contexts/ListContext";
import { ModalContext } from "../contexts/ModalContext";
import LottieControlConfetti from "../hooks/confettiControl";
import LottieControlBucket from "../hooks/bucketControl";
import { COLORS, FONTS, SIZES } from "../styles/theme";

function Bucket() {
  const listContext = useContext(ListContext);
  const totalHope = listContext.list.length;

  const modalContext = useContext(ModalContext);
  const setShowListModal = modalContext.setShowListModal;
  const showListModal = modalContext.showListModal;
  const copyMessage = modalContext.copyMessage;

  const toggleListModal = () => setShowListModal(!showListModal);

  const getMessage = () => {
    if (copyMessage && totalHope === 3) return copyMessage;
    if (totalHope === 3) return "Congrats! You filled your HopeBucket!";
    if (totalHope < 3) return "Add hope to fill up your HopeBucket!";
    return "";
  };

  return (
    <View style={styles.container}>
      <LottieControlConfetti />
      <View style={styles.messageRow}>
        <Text style={styles.topMessage}>{getMessage()}</Text>
        {copyMessage ? (
          <Text style={styles.subMessage}>
            Find a background on{" "}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL("https://pixabay.com")}
            >
              Pixabay
            </Text>
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.bucketIcon}
        onPress={toggleListModal}
        activeOpacity={0.7}
      >
        <Text style={styles.hopeCount}>{totalHope} of 3</Text>
        <LottieControlBucket />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  messageRow: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: SIZES.paddingMedium,
  },
  topMessage: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.headingFont,
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 35,
  },
  subMessage: {
    fontFamily: FONTS.body,
    fontSize: SIZES.subheadingFont,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 15,   
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  bucketIcon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    
  },
  hopeCount: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.hopeCountFont,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    position: "relative",
    top: 10,
    width: 198,
    zIndex: 10,
  },
});

export default Bucket;
