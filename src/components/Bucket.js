import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ListContext } from "../contexts/ListContext";
import { ModalContext } from "../contexts/ModalContext";
import { QuoteContext } from "../contexts/QuoteContext";
import LottieControlConfetti from "../hooks/confettiControl";
import LottieControlBucket from "../hooks/bucketControl";
import { COLORS, FONTS, SIZES } from "../styles/theme";

function Bucket() {
  const { list = [] } = useContext(ListContext);
  const { quotes = [] } = useContext(QuoteContext);
  const totalHope = list.length;
  const [selectedQuote, setSelectedQuote] = useState(null);
  const floatValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const modalContext = useContext(ModalContext);
  const setShowListModal = modalContext.setShowListModal;
  const showListModal = modalContext.showListModal;

  const toggleListModal = () => setShowListModal(!showListModal);
  const handleCopyQuote = async () => {
    if (!selectedQuote) {
      return;
    }

    try {
      await Clipboard.setStringAsync(selectedQuote);
      Alert.alert("Copied", "Quote copied to clipboard.");
    } catch (err) {
      console.error("Error copying quote:", err);
      Alert.alert("Copy failed", "Couldn't copy quote right now. Please try again.");
    }
  };

  useEffect(() => {
    const animations = floatValues.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 1400 + index * 250,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 1400 + index * 250,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [floatValues]);

  const getMessage = () => {
    if (totalHope < 3) {
      return "Add hope to fill up your HopeBucket!";
    }
    if (totalHope === 3) {
      return "Congrats! You filled your HopeBucket!";
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <LottieControlConfetti />
      <View style={styles.messageRow}>
        <Text style={styles.topMessage}>{getMessage()}</Text>
      </View>
      <View style={styles.bucketIcon}>
        <TouchableOpacity
          style={styles.bucketTapArea}
          onPress={toggleListModal}
          activeOpacity={0.7}
        >
          <Text style={styles.hopeCount}>{totalHope} of 3</Text>
          <LottieControlBucket />
        </TouchableOpacity>

        {quotes.slice(0, 3).map((quote, index) => {
          const floatY = floatValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
          });

          return (
            <Animated.View
              key={String(quote.id)}
              style={[
                styles.quoteBubble,
                styles[`quoteBubble${index + 1}`],
                { transform: [{ translateY: floatY }] },
              ]}
            >
              <TouchableOpacity
                style={styles.quoteBubbleButton}
                onPress={() => setSelectedQuote(quote.text)}
                accessibilityLabel={`View quote ${index + 1}`}
              >
                <Ionicons name="chatbubble-ellipses" size={30} color={COLORS.white} />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <Modal
        visible={Boolean(selectedQuote)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedQuote(null)}
      >
        <Pressable style={styles.quoteBackdrop} onPress={() => setSelectedQuote(null)}>
          <Pressable style={styles.quoteCard}>
            <Text style={styles.quoteCardText}>"{selectedQuote}"</Text>
            <TouchableOpacity
              style={styles.copyQuoteButton}
              onPress={handleCopyQuote}
              accessibilityRole="button"
              accessibilityLabel="Copy quote"
            >
              <Ionicons name="copy-outline" size={18} color={COLORS.white} />
              <Text style={styles.copyQuoteButtonText}>Copy Quote</Text>
            </TouchableOpacity>
            <Text style={styles.quoteTapHint}>Tap anywhere to close</Text>
          </Pressable>
        </Pressable>
      </Modal>
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
    zIndex: 1,
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
    width: "100%",
    position: "relative",
    bottom: 50,
  },
  bucketTapArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  hopeCount: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.hopeCountFont,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    position: "relative",
    width: 198,
    zIndex: 10,
  },
  quoteBubble: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  quoteBubbleButton: {
    height: 70,
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  quoteBubble1: {
    top: "10%",
    left: "10%",
  },
  quoteBubble2: {
    top: "5%",
    right: "18%",
  },
  quoteBubble3: {
    top: "34%",
    right: "12%",
  },
  quoteBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  quoteCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SIZES.paddingMedium,
  },
  quoteCardText: {
    fontFamily: FONTS.body,
    fontSize: 24,
    lineHeight: 34,
    color: COLORS.primary,
    textAlign: "center",
  },
  copyQuoteButton: {
    marginTop: 14,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  copyQuoteButtonText: {
    fontFamily: FONTS.body,
    fontSize: 20,
    color: COLORS.white,
  },
  quoteTapHint: {
    marginTop: 12,
    fontFamily: FONTS.body,
    fontSize: 20,
    color: COLORS.primary,
    textAlign: "center",
    opacity: 0.8,
  },
});

export default Bucket;
