import React, { createContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

export const ExpContext = createContext();

export const ExpContextProvider = (props) => {
  const [expDate, setListDate, isLoaded] = useAsyncStorage("listDate", "");

  return (
    <ExpContext.Provider value={{ expDate, setListDate, isLoaded }}>
      {props.children}
    </ExpContext.Provider>
  );
};
