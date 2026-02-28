import React, { createContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

export const QuoteContext = createContext();

export const QuoteContextProvider = ({ children }) => {
  const [quotes, setQuotes, isLoaded] = useAsyncStorage("customQuotes", []);

  const addQuote = (text) => {
    if (quotes.length >= 3) return false;

    const trimmed = text.trim().slice(0, 140);
    if (!trimmed) return false;

    setQuotes((prevQuotes) => [...prevQuotes, { id: Date.now(), text: trimmed }]);
    return true;
  };

  const removeQuote = (id) => {
    setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
  };

  return (
    <QuoteContext.Provider value={{ quotes, addQuote, removeQuote, isLoaded }}>
      {children}
    </QuoteContext.Provider>
  );
};
