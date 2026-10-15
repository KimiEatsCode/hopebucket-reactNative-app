import React, { createContext, useState } from "react";
import { getActiveStoreShotModals } from "../storeScreenshots";

export const ModalContext = createContext();

export const ModalContextProvider = (props) => {
  const storeShotModals = getActiveStoreShotModals();
  const [showListModal, setShowListModal] = useState(storeShotModals.showListModal);
  const [showAddField, setShowAddField] = useState(storeShotModals.showAddField);
  const [triggerScreenshot, setTriggerScreenshot] = useState(false);
  const [showValuesModal, setShowValuesModal] = useState(storeShotModals.showValuesModal);

  return (
    <ModalContext.Provider
      value={{
        showListModal,
        setShowListModal,
        showAddField,
        setShowAddField,
        triggerScreenshot,
        setTriggerScreenshot,
        showValuesModal,
        setShowValuesModal,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};
