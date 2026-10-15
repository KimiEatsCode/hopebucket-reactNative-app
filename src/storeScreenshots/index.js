import { STORE_SHOT_ENABLED, STORE_SHOT_SCENE } from "./activeScene";
import { getStoreShotModals, getStoreShotSeed } from "./scenes";

export function getStoreShot() {
  if (!STORE_SHOT_ENABLED || !STORE_SHOT_SCENE) {
    return { enabled: false, scene: null };
  }

  return { enabled: true, scene: STORE_SHOT_SCENE };
}

export function getActiveStoreShotSeed(key) {
  const { enabled, scene } = getStoreShot();
  if (!enabled) return undefined;
  return getStoreShotSeed(key, scene);
}

export function getActiveStoreShotModals() {
  const { enabled, scene } = getStoreShot();
  if (!enabled) {
    return {
      showListModal: false,
      showAddField: false,
      showValuesModal: false,
      showQuoteModal: false,
    };
  }
  return getStoreShotModals(scene);
}

export { DEMO_QUOTES } from "./scenes";
