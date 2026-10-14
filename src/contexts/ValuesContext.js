import React, { createContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

export const ValuesContext = createContext();

export const ValuesContextProvider = ({ children }) => {
  const [values, setValues, isLoaded] = useAsyncStorage("userValues", []);

  const addValue = (text) => {
    if (values.length >= 5) return false;

    const trimmed = text.trim().slice(0, 60);
    if (!trimmed) return false;

    setValues((prev) => [...prev, { id: Date.now(), text: trimmed }]);
    return true;
  };

  const removeValue = (id) => {
    setValues((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <ValuesContext.Provider value={{ values, addValue, removeValue, isLoaded }}>
      {children}
    </ValuesContext.Provider>
  );
};
