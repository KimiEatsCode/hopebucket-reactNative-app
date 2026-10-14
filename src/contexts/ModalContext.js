import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = (props) => {
  const [showListModal, setShowListModal] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [triggerScreenshot, setTriggerScreenshot] = useState(false);
  const [showValuesModal, setShowValuesModal] = useState(false);

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
