import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ListContext } from "../contexts/ListContext";
import { ModalContext } from "../contexts/ModalContext";
import LottieControlNavMsg from "../hooks/navMsgControl";
import { COLORS, FONTS, SIZES, BORDERS } from "../styles/theme";

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
  const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });
  const todayStr = dayOfWeek + " " + mm + "/" + dd1 + "/" + yyyy;

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
        <Ionicons name="remove-circle-outline" size={30} color={COLORS.deleteButton} />
      </TouchableOpacity>
      <Text style={styles.hopeItemText}>{item.value}</Text>
    </View>
  );

  const headerText =
    totalHope < 3
      ? `${totalHope} of 3 Completed`
      : `${totalHope} of 3 Completed`;

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
            <View style={styles.modalBody}>
              {totalHope === 0 && (
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  persistentScrollbar={true}
                >
                  <Text style={styles.modalTitle}>Happy {todayStr}! </Text>
                  
                  <Text style={styles.instructions}>
                    Add 3 items of hope to fill up your HopeBucket!
                  </Text>
                </ScrollView>
              )}

              <FlatList
                data={[...list].reverse()}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                style={styles.flatList}
                contentContainerStyle={[
                  styles.flatListContent,
                  totalHope === 0 && styles.flatListContentEmpty,
                ]}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
              />

              {totalHope < 3 && (
                <View style={styles.lottieContainer}>
                  <LottieControlNavMsg />
                </View>
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
    marginBottom: SIZES.paddingMedium,
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
  lottieContainer: {
    flex: 1,
    width: "100%",
  },
    modalBody: {
    backgroundColor: COLORS.background,
    minHeight: "90%",
    border: COLORS.primary,
    borderBottomLeftRadius: SIZES.modalRadius,
    borderBottomRightRadius: SIZES.modalRadius,
    padding: SIZES.paddingLarge,
  },
  flatList: {
    flex:1,
    minHeight:"80%",
  },
  flatListContent: {
    justifyContent: "flex-start",
    paddingLeft: SIZES.paddingMedium,
    paddingBottom: SIZES.paddingLarge,
    paddingTop: SIZES.paddingLarge,
    borderRadius: SIZES.modalRadiusInside,
    borderWidth:3,
    borderColor: COLORS.primary,
  },
  flatListContentEmpty: {
    borderWidth: 0,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingVertical: 6,
    width: "100%",
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
    flexWrap: "wrap",
    paddingRight: SIZES.paddingMedium,
  },
});

export default ListModal;
