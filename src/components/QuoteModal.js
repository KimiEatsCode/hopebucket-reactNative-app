import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { QuoteContext } from "../contexts/QuoteContext";
import { COLORS, FONTS, SIZES } from "../styles/theme";

function QuoteModal({ visible, onClose }) {
  const { quotes = [], addQuote, removeQuote } = useContext(QuoteContext);
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);
  const charLimit = 140;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const handleShow = (event) => {
      const height = event?.endCoordinates?.height ?? 0;
      setKeyboardHeight(Math.max(0, height - insets.bottom));
    };

    const handleHide = () => setKeyboardHeight(0);

    const showSub = Keyboard.addListener(showEvent, handleShow);
    const hideSub = Keyboard.addListener(hideEvent, handleHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  const canAdd = quotes.length < 3;
  const charsLeft = charLimit - input.length;

  const handleAdd = () => {
    const success = addQuote(input);
    if (success) setInput("");
  };

  const handleClose = () => {
    setInput("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={handleClose} />

        <View style={[styles.contentWrapper, { paddingBottom: keyboardHeight }]}>
          <View
            style={[
              styles.content,
              { paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 12) : 12 },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.title}>My Quotes ({quotes.length}/3)</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={30} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={[styles.bodyContent, { paddingBottom: canAdd ? 10 : 24 }]}
              keyboardShouldPersistTaps="handled"
            >
              {quotes.length === 0 ? (
                <Text style={styles.emptyText}>Add a personal quote that inspires you.</Text>
              ) : null}

              {quotes.map((quote) => (
                <View key={String(quote.id)} style={styles.quoteItem}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeQuote(quote.id)}
                    accessibilityLabel="Remove quote"
                  >
                    <Ionicons name="close-circle-outline" size={26} color={COLORS.deleteButton} />
                  </TouchableOpacity>
                  <Text style={styles.quoteText}>"{quote.text}"</Text>
                </View>
              ))}

              {canAdd ? (
                <View style={styles.inputArea}>
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type an inspiring quote..."
                    placeholderTextColor="#999"
                    maxLength={charLimit}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={handleAdd}
                  />
                </View>
              ) : (
                <View style={styles.maxContainer}>
                  <Text style={styles.maxText}>Maximum of 3 quotes reached.</Text>
                  <Text style={styles.maxText}>Remove one to add a new quote.</Text>
                </View>
              )}
            </ScrollView>

            {canAdd ? (
              <View style={styles.inputFooter}>
                <Text style={[styles.charCount, charsLeft <= 20 && styles.charCountWarning]}>
                  {charsLeft} characters left
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, !input.trim() && styles.addButtonDisabled]}
                  onPress={handleAdd}
                  disabled={!input.trim()}
                >
                  <Ionicons name="checkmark-circle" size={32} color={COLORS.white} />
                  <Text style={styles.addButtonText}>Add Quote</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
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
  contentWrapper: {
    width: "100%",
    
  },
  content: {
 
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    color: COLORS.primary,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    backgroundColor: COLORS.white,
  },
  bodyContent: {
    padding: SIZES.paddingMedium,
    gap: 12,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
  },
  quoteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  removeButton: {
    marginRight: 6,
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 20,
    color: COLORS.primary,
    lineHeight: 28,
  },
  inputArea: {
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    color: COLORS.textDark,
    fontFamily: FONTS.body,
    fontSize: 20,
  },
  inputFooter: {
    paddingHorizontal: SIZES.paddingMedium,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: "stretch",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  charCount: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: "#6b7280",
  },
  charCountWarning: {
    color: "#dc2626",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: SIZES.navButtonRadius,
    width: "100%",
    gap: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.heading,
    fontSize: 18,
    fontWeight: "bold",
  },
  maxContainer: {
    alignItems: "center",
    marginTop: 6,
  },
  maxText: {
    fontFamily: FONTS.body,
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
  },
});

export default QuoteModal;
