export const STORE_SHOT_SCENES = [
  "welcome",
  "home-empty",
  "add-hope",
  "home-filling",
  "list",
  "quotes",
  "quote-card",
  "values",
  "home-full",
];

export const DEMO_VALUES = [
  { id: 1, text: "Family" },
  { id: 2, text: "Health" },
  { id: 3, text: "Gratitude" },
  { id: 4, text: "Growth" },
  { id: 5, text: "Kindness" },
];

export const DEMO_QUOTES = [
  { id: 1, text: "Hope is the thing with feathers that perches in the soul." },
  { id: 2, text: "This too shall pass. Keep going." },
  { id: 3, text: "You are doing better than you think." },
];

export const DEMO_LIST_PARTIAL = [
  {
    id: 1,
    value: "I am grateful for a quiet morning and a warm cup of tea.",
    tag: "Gratitude",
  },
  {
    id: 2,
    value: "An action I took that gives me hope is calling a friend.",
    tag: "Kindness",
  },
  {
    id: 3,
    value: "Something I can look forward to is a walk after dinner.",
    tag: "Health",
  },
  {
    id: 4,
    value: "Something that happened today that gives me hope is a kind message from my sister.",
    tag: "Family",
  },
  {
    id: 5,
    value: "A person, thing or animal that gives me hope is my dog.",
    tag: null,
  },
  {
    id: 6,
    value: "I can get through today by taking one small step at a time.",
    tag: "Growth",
  },
];

export const DEMO_LIST_FULL = [
  ...DEMO_LIST_PARTIAL,
  {
    id: 7,
    value: "I am grateful for a safe place to rest tonight.",
    tag: "Gratitude",
  },
  {
    id: 8,
    value: "Something I can look forward to is cooking a meal I love.",
    tag: "Health",
  },
  {
    id: 9,
    value: "An action I took that gives me hope is writing down what matters.",
    tag: "Growth",
  },
  {
    id: 10,
    value: "I felt hope when I noticed the sky this morning.",
    tag: null,
  },
];

function getTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
}

const EMPTY_SCENES = new Set(["welcome", "home-empty", "add-hope"]);
const FULL_SCENES = new Set(["home-full"]);

export function getStoreShotSeed(key, scene) {
  if (key === "hasSeenWelcome") {
    return scene !== "welcome";
  }

  if (key === "hopeList") {
    if (EMPTY_SCENES.has(scene)) return [];
    if (FULL_SCENES.has(scene)) return DEMO_LIST_FULL;
    return DEMO_LIST_PARTIAL;
  }

  if (key === "customQuotes") {
    if (EMPTY_SCENES.has(scene)) return [];
    return DEMO_QUOTES;
  }

  if (key === "userValues") {
    if (scene === "welcome" || scene === "home-empty") return [];
    return DEMO_VALUES;
  }

  if (key === "listDate") {
    return getTomorrow();
  }

  return undefined;
}

export function getStoreShotModals(scene) {
  return {
    showListModal: scene === "list",
    showAddField: scene === "add-hope",
    showValuesModal: scene === "values",
    showQuoteModal: scene === "quotes",
  };
}
