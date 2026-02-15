import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  AppState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ListContext } from "../contexts/ListContext";
import { ExpContext } from "../contexts/ExpContext";
import { ModalContext } from "../contexts/ModalContext";
import { COLORS, FONTS, SIZES } from "../styles/theme";

const SUGGESTIONS = [
  "Even though I am sad, mad something I can do to get through the day is ",
  "I am grateful for ",
  "A person, thing, event, or animal that gives me hope is ",
  "An action I took that gives me hope is ",
  "Something I can look forward to is ",
  "Something that happened today that gives me hope is ",
];

function getToday() {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}

function getTomorrow() {
  const now = new Date();
  now.setDate(now.getDate() + 1); // handles month/year rollover
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
}

function NavBar() {
  const [showAddField, setShowAddField] = useState(false);
  const [showNewList, setShowListLinks] = useState(false);
  const [input, setInput] = useState("");

  const expContext = useContext(ExpContext);
  const expDate = expContext.expDate;

  const listContext = useContext(ListContext);
  const list = listContext.list;
  const setList = listContext.setList; // stable ref (useCallback)
  const listIsLoaded = listContext.isLoaded;
  const totalHope = list.length;

  const modalContext = useContext(ModalContext);
  const showListModal = modalContext.showListModal;
  const setShowListModal = modalContext.setShowListModal;
  const setCopyMessage = modalContext.setCopyMessage;

  const toggleListModal = () => setShowListModal(!showListModal);
  const inputRef = useRef(null);

  // Check for expiry when app returns from background
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && getToday() === expDate) {
        setShowListLinks(true);
        setList([]);
      }
    });
    return () => sub.remove();
  }, [expDate, setList]);

  // Check for midnight reset
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (getToday() === expDate) {
        setShowListLinks(true);
        setList([]);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expDate, setList]);

  // Clear list immediately when data loads if the day has expired
  useEffect(() => {
    if (listIsLoaded && expContext.isLoaded) {
      if (getToday() === expDate) {
        setShowListLinks(true);
        setList([]);
      }
    }
  }, [listIsLoaded, expContext.isLoaded, expDate, setList]);

  const handleNewList = () => {
    if (totalHope < 3) {
      setShowListLinks(false);
      expContext.setListDate(getTomorrow());
      setList([]);
    }
  };

  useEffect(() => {
    if (totalHope === 3 || expDate !== getTomorrow()) {
      setShowListLinks(true);
    } else {
      setShowListLinks(false);
    }
  }, [totalHope, expDate]);

  const handleCopyClick = async () => {
    let copyText = "";
    list.forEach((item) => {
      copyText += `${item.value}\n\n`;
    });

    try {
      await Clipboard.setStringAsync(copyText);
      setCopyMessage("HopeBucket Copied!");
    } catch (err) {
      console.error("Error copying text to clipboard:", err);
    }
  };

  function addItem() {
    if (list.length >= 3) {
      setShowAddField(false);
      return;
    }
    if (input.trim() !== "") {
      const newItem = {
        id: Math.random(),
        value: input,
      };
      setList((prevList) => [...prevList, newItem]);
      setInput("");
      setShowAddField(false);
    }
  }

  const handleOpen = () => {
    if (totalHope < 3) {
      setShowAddField(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  };

  const handleClose = () => setShowAddField(false);

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Add Item Modal (replaces Offcanvas) */}
      <Modal
        visible={showAddField}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.addModalBackdrop}
        >
          <TouchableOpacity
            style={styles.addModalDismiss}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.addModalContent}>
            {/* Suggestions */}
            <Text style={styles.suggestionsLabel}>
              Tap a suggestion to start:
            </Text>
            <ScrollView
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsScroll}
              contentContainerStyle={styles.suggestionsContainer}
            >
              {SUGGESTIONS.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionChip}
                  onPress={() => handleSuggestion(s)}
                >
                  <Text style={styles.suggestionText}>{s.trim()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Text Input */}
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={addItem}
            />

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmButton} onPress={addItem}>
              <Ionicons
                name="checkmark-circle"
                size={32}
                color={COLORS.white}
              />
              <Text style={styles.confirmButtonText}>Add Hope</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        {showNewList ? (
          <>
            {totalHope >= 3 ? (
              <TouchableOpacity
                style={[styles.navButton, styles.flexGrow1]}
                onPress={toggleListModal}
              >
                <Ionicons
                  name="document-outline"
                  size={SIZES.iconFont}
                  color={COLORS.white}
                />
                <Text style={styles.navButtonText}>View List</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.newListButton, styles.flexGrow1]}
                onPress={handleNewList}
              >
                <Ionicons
                  name="document-text-outline"
                  size={SIZES.iconFont}
                  color={COLORS.white}
                />
                <Text style={styles.navButtonText}>New List</Text>
              </TouchableOpacity>
            )}

            {totalHope >= 3 ? (
              <TouchableOpacity
                style={[styles.navButton, styles.flexGrow1]}
                onPress={handleCopyClick}
              >
                <Ionicons
                  name="copy-outline"
                  size={SIZES.iconFont}
                  color={COLORS.white}
                />
                <Text style={styles.navButtonText}>Copy List</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navButton, styles.disabledButton]}
                disabled
              >
                <Ionicons
                  name="add-circle"
                  size={SIZES.iconFont}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.navButton, styles.flexGrow2]}
              onPress={toggleListModal}
            >
              <Ionicons
                name="document-outline"
                size={SIZES.iconFont}
                color={COLORS.white}
              />
              <Text style={styles.navButtonText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.flexGrow2,
                totalHope >= 3 && styles.disabledButton,
              ]}
              onPress={handleOpen}
              disabled={totalHope >= 3}
            >
              <Ionicons
                name="add-circle"
                size={SIZES.iconFont}
                color={COLORS.white}
              />
              <Text style={styles.navButtonText}>Add</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Add Modal Styles
  addModalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  addModalDismiss: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  addModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SIZES.paddingLarge,
    paddingBottom: 40,
  },
  suggestionsLabel: {
    fontFamily: FONTS.body,
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 10,
  },
  suggestionsScroll: {
    marginBottom: 12,
    maxHeight: 50,
  },
  suggestionsContainer: {
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  suggestionText: {
    fontFamily: FONTS.body,
    fontSize: 20,
    color: COLORS.white,
  },
  textInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    fontFamily: FONTS.body,
    minHeight: 100,
    marginBottom: 16,
    color: COLORS.textDark,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: SIZES.navButtonRadius,
    gap: 8,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: "bold",
  },

  // Bottom Nav Bar
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 14,
    backgroundColor: COLORS.background,
  },
  navButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: SIZES.navButtonRadius,
    gap: 8,
  },
  navButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.body,
    fontSize: 24,
    fontWeight: "600",
  },
  newListButton: {
    // Same as navButton, could add shake animation later
  },
  disabledButton: {
    opacity: 0.5,
  },
  flexGrow1: {
    flex: 1,
  },
  flexGrow2: {
    flex: 2,
  },
  flexGrow3: {
    flex: 3,
  },
});

export default NavBar;
