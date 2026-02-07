import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = (props) => {
  const [showListModal, setShowListModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  return (
    <ModalContext.Provider
      value={{ showListModal, setShowListModal, copyMessage, setCopyMessage }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};
