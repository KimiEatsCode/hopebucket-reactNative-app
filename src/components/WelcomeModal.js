import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SIZES } from "../styles/theme";

const STEPS = [
  {
    icon: "heart-outline",
    step: "STEP 1",
    title: "Add what gives you hope",
    description:
      "Tap Add in the bar below and write up to 3 things that give you hope today — big or small.",
  },
  {
    icon: "water-outline",
    step: "STEP 2",
    title: "Watch your bucket fill",
    description:
      "Each item fills your HopeBucket. Come back tomorrow to start fresh with a new list.",
  },
  {
    icon: "chatbubble-ellipses-outline",
    step: "STEP 3",
    title: "Add inspiring quotes",
    description:
      "Tap Quotes in the bar below to save up to 3 personal quotes that inspire you — they'll appear in your bucket.",
  },
];

function WelcomeModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 16) : 16 },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Welcome to HopeBucket</Text>
              <Text style={styles.subtitle}>
                Fill your bucket with hope, one thought at a time.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Steps */}
          <ScrollView
            contentContainerStyle={styles.stepsContainer}
            showsVerticalScrollIndicator={false}
          >
            {STEPS.map((item, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={[styles.iconCircle, index === 0 && styles.iconCircleLight]}>
                  <Ionicons
                    name={item.icon}
                    size={30}
                    color={index === 0 ? COLORS.primary : COLORS.white}
                  />
                </View>
                <View style={styles.stepText}>
                  <Text style={styles.stepLabel}>{item.step}</Text>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaButton} onPress={onClose}>
            <Text style={styles.ctaText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: COLORS.modalBackdrop,
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingHorizontal: SIZES.paddingMedium,
    paddingTop: 10,
    maxHeight: "85%",
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
    alignSelf: "center",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.textDark,
    fontStyle: "italic",
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.primary,
    marginBottom: 14,
  },
  stepsContainer: {
    gap: 12,
    paddingBottom: 16,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.modalRadiusInside,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    padding: SIZES.paddingMedium,
    gap: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconCircleLight: {
    backgroundColor: "#e8eef8",
  },
  stepText: {
    flex: 1,
  },
  stepLabel: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "bold",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  stepTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.navButtonRadius,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  ctaText: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "bold",
  },
});

export default WelcomeModal;
