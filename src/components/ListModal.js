import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListContext } from "../contexts/ListContext";
import { ModalContext } from "../contexts/ModalContext";
import LottieControlNavMsg from "../hooks/navMsgControl";
import { COLORS, FONTS, SIZES } from "../styles/theme";

function ListModal() {
  const listContext = useContext(ListContext);
  const list = listContext.list;
  const totalHope = list.length;

  const modalContext = useContext(ModalContext);
  const showListModal = modalContext.showListModal;
  const setShowListModal = modalContext.setShowListModal;

  const handleClose = () => setShowListModal(false);

  const today = new Date();
  const dd1 = today.getDate();
  const mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  const todayStr = mm + "/" + dd1 + "/" + yyyy;

  function deleteItem(key) {
    const updateList = list.filter((item) => item.id !== key);
    listContext.setList(updateList);
  }

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Ionicons name="close" size={24} color={COLORS.deleteButton} />
      </TouchableOpacity>
      <Text style={styles.hopeItemText}>{item.value}</Text>
    </View>
  );

  const headerText =
    totalHope < 3
      ? `Today ${todayStr} - ${totalHope} of 3 Completed`
      : `Congrats! You filled your HopeBucket! ${totalHope} of 3 Completed. List expires at midnight.`;

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
                <Ionicons name="close" size={28} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {/* Body */}
            <View style={styles.modalBody}>
              {totalHope === 0 && (
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructions}>
                    Add 3 items of hope to be able to copy and share. Your
                    bucket resets each day at midnight. Each day is a new
                    beginning!
                  </Text>
                </View>
              )}

              {totalHope < 3 && (
                <View style={styles.lottieContainer}>
                  <LottieControlNavMsg />
                </View>
              )}

              <FlatList
                data={[...list].reverse()}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
              />
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
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.modalRadius,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: "hidden",
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
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    lineHeight: 22,
    paddingRight: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    backgroundColor: COLORS.background,
    minHeight: 300,
    maxHeight: 500,
    borderBottomLeftRadius: SIZES.modalRadius,
    borderBottomRightRadius: SIZES.modalRadius,
    padding: SIZES.paddingMedium,
  },
  instructionsContainer: {
    alignItems: "center",
    paddingVertical: SIZES.paddingMedium,
    paddingHorizontal: SIZES.paddingLarge,
  },
  instructions: {
    fontFamily: FONTS.body,
    fontSize: SIZES.bodyFont,
    color: COLORS.primary,
    textAlign: "center",
    lineHeight: 24,
  },
  lottieContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: SIZES.paddingLarge,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
    paddingVertical: 4,
  },
  deleteButton: {
    paddingTop: 2,
    paddingRight: 8,
  },
  hopeItemText: {
    flex: 1,
    fontFamily: FONTS.hopeItem,
    fontWeight: "900",
    fontSize: SIZES.hopeItemFont,
    color: COLORS.primary,
    letterSpacing: 0.8,
    lineHeight: 30,
  },
});

export default ListModal;
