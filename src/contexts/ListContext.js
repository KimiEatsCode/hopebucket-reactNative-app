import React, { createContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

export const ListContext = createContext();

export const ListContextProvider = (props) => {
  const [list, setList, isLoaded] = useAsyncStorage("hopeList", []);

  const copyText = false;
  return (
    <ListContext.Provider value={{ list, setList, copyText, isLoaded }}>
      {props.children}
    </ListContext.Provider>
  );
};
