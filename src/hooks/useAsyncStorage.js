import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getActiveStoreShotSeed } from "../storeScreenshots";

export function useAsyncStorage(key, initialValue) {
  const storeShotSeed = getActiveStoreShotSeed(key);
  const [storedValue, setStoredValue] = useState(
    storeShotSeed !== undefined ? storeShotSeed : initialValue
  );
  const [isLoaded, setIsLoaded] = useState(storeShotSeed !== undefined);
  const isInitialMount = useRef(true);

  // Load from AsyncStorage on mount
  useEffect(() => {
    if (storeShotSeed !== undefined) {
      setIsLoaded(true);
      return;
    }

    const loadValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.log("Error loading from AsyncStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadValue();
  }, [key, storeShotSeed]);

  // Save to AsyncStorage whenever storedValue changes (skip initial mount)
  useEffect(() => {
    if (storeShotSeed !== undefined) {
      return;
    }
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isLoaded) return;

    const saveValue = async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.log("Error saving to AsyncStorage:", error);
      }
    };
    saveValue();
  }, [key, storedValue, isLoaded]);

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue, isLoaded];
}
