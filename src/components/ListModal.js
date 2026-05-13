import React, { useContext, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { ListContext } from "../contexts/ListContext";
import { ModalContext } from "../contexts/ModalContext";
import { COLORS, FONTS, SIZES } from "../styles/theme";

function ListModal() {
  const listContext = useContext(ListContext);
  const list = listContext.list ?? [];
  const totalHope = list.length;

  const modalContext = useContext(ModalContext);
  const showListModal = modalContext.showListModal;
  const setShowListModal = modalContext.setShowListModal;
  const setShowAddField = modalContext.setShowAddField;
  const triggerScreenshot = modalContext.triggerScreenshot;
  const setTriggerScreenshot = modalContext.setTriggerScreenshot;

  const viewShotRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleClose = () => setShowListModal(false);

  // When NavBar fires triggerScreenshot, open the modal then capture
  useEffect(() => {
    if (!triggerScreenshot) return;
    setTriggerScreenshot(false);
    setShowListModal(true);
    setTimeout(() => setIsCapturing(true), 100);
  }, [triggerScreenshot, setTriggerScreenshot, setShowListModal]);

  useEffect(() => {
    if (!isCapturing || !viewShotRef.current) return;
    viewShotRef.current
      .capture()
      .then(async (uri) => {
        setIsCapturing(false);
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(uri, { mimeType: "image/png" });
        } else {
          Alert.alert("Screenshot saved", "Your screenshot has been captured.");
        }
      })
      .catch((err) => {
        setIsCapturing(false);
        console.error("Screenshot error:", err);
        Alert.alert("Error", "Could not capture screenshot.");
      });
  }, [isCapturing]);

  const handleScreenshot = () => setIsCapturing(true);

  const handleAddHope = () => {
    setShowListModal(false);
    setShowAddField(true);
  };

  const today = new Date();
  const dd1 = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const todayStr = dayOfWeek + " " + mm + "/" + dd1 + "/" + yyyy;

  function deleteItem(key) {
    listContext.setList((prevList) =>
      prevList.filter((item) => item.id !== key)
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Ionicons name="remove-circle-outline" size={30} color={COLORS.deleteButton} />
      </TouchableOpacity>
      <Text style={styles.hopeItemText}>{item.value}</Text>
    </View>
  );

  const headerText =
    totalHope >= 3
      ? `Congrats! ${totalHope} of 3 Completed.`
      : `${dayOfWeek}, ${mm}/${dd1}/${yyyy} — ${totalHope} of 3`;

  return (
    <Modal
      visible={showListModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{headerText}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={40} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
              <View style={styles.modalBody}>
                {totalHope === 0 ? (
                  <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateTitle}>Happy {todayStr}!</Text>
                    <Text style={styles.instructions}>
                      Add 3 items of hope to fill up your HopeBucket!
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={[...list].reverse()}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    style={styles.flatList}
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={true}
                    persistentScrollbar={true}
                  />
                )}
              </View>
            </ViewShot>

            {/* Footer */}
            <View style={styles.modalFooter}>
              {totalHope < 3 ? (
                <TouchableOpacity
                  style={styles.addHopeButton}
                  onPress={handleAddHope}
                >
                  <Ionicons name="add-circle" size={22} color={COLORS.white} />
                  <Text style={styles.addHopeButtonText}>Add Hope</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.addHopeButton}
                  onPress={handleScreenshot}
                  disabled={isCapturing}
                >
                  <Ionicons name="camera" size={22} color={COLORS.white} />
                  <Text style={styles.addHopeButtonText}>
                    {isCapturing ? "Capturing…" : "Screenshot"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.modalBackdrop,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "85%",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.modalRadius,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.paddingMedium,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  modalTitle: {
    flex: 1,
    fontFamily: FONTS.heading,
    fontSize: SIZES.subheadingFont,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
    paddingRight: 8,

  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  instructions: {
    fontFamily: FONTS.body,
    fontSize: SIZES.subheadingFont,
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 35,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SIZES.paddingMedium,
  },
  emptyStateTitle: {
    fontFamily: FONTS.heading,
    fontSize: SIZES.subheadingFont,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: SIZES.paddingMedium,
  },
  lottieContainer: {
    flex: 1,
    width: "100%",
  },
    modalBody: {
    backgroundColor: COLORS.background,
    minHeight: "80%",
    border: COLORS.primary,
    borderBottomLeftRadius: SIZES.modalRadius,
    borderBottomRightRadius: SIZES.modalRadius,
    padding: SIZES.paddingLarge,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 12,
  },
  flatList: {
    flex:1,
    minHeight:"100%",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  flatListContent: {
    justifyContent: "flex-start",

    paddingBottom: SIZES.paddingMedium,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingVertical: 10,
    width: "100%",
  },
  deleteButton: {
    fontSize: SIZES.iconFont,
    paddingTop: 2,
    paddingRight: 8,
  },
  hopeItemText: {
    flex: 1,
    fontFamily: FONTS.hopeItem,
    fontWeight: "700",
    fontSize: SIZES.hopeItemFont,
    color: COLORS.primary,
    letterSpacing: 0.8,
    lineHeight: 30,
    flexWrap: "wrap",
    paddingRight: SIZES.paddingMedium,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: SIZES.paddingMedium,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
  },
  addHopeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: SIZES.navButtonRadius,
    gap: 6,
  },
  addHopeButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ListModal;
