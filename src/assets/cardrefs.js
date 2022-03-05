const CARDS_DICT = {
  "7D": {
    name: "7D",
    unicodeChar: "🃇",
    image: "",
  },
  "8D": {
    name: "8D",
    unicodeChar: "🃈",
    image: "",
  },
  "9D": {
    name: "9D",
    unicodeChar: "🃉",
    image: "",
  },
  "0D": {
    name: "0D",
    unicodeChar: "🃊",
    image: "",
  },
  JD: {
    name: "JD",
    unicodeChar: "🃋",
    image: "",
  },
  QD: {
    name: "QD",
    unicodeChar: "🃍",
    image: "",
  },
  KD: {
    name: "KD",
    unicodeChar: "🃎",
    image: "",
  },
  AD: {
    name: "AD",
    unicodeChar: "🃁",
    image: "",
  },
  "7H": {
    name: "7H",
    unicodeChar: "🂷",
    image: "",
  },
  "8H": {
    name: "8H",
    unicodeChar: "🂸",
    image: "",
  },
  "9H": {
    name: "9H",
    unicodeChar: "🂹",
    image: "",
  },
  "0H": {
    name: "0H",
    unicodeChar: "🂺",
    image: "",
  },
  JH: {
    name: "JH",
    unicodeChar: "🂻",
    image: "",
  },
  QH: {
    name: "QH",
    unicodeChar: "🂽",
    image: "",
  },
  KH: {
    name: "KH",
    unicodeChar: "🂾",
    image: "",
  },
  AH: {
    name: "AH",
    unicodeChar: "🂱",
    image: "",
  },
  "7C": {
    name: "7C",
    unicodeChar: "🃗",
    image: "",
  },
  "8C": {
    name: "8C",
    unicodeChar: "🃘",
    image: "",
  },
  "9C": {
    name: "9C",
    unicodeChar: "🃙",
    image: "",
  },
  "0C": {
    name: "0C",
    unicodeChar: "🃚",
    image: "",
  },
  JC: {
    name: "JC",
    unicodeChar: "🃛",
    image: "",
  },
  QC: {
    name: "QC",
    unicodeChar: "🃝",
    image: "",
  },
  KC: {
    name: "KC",
    unicodeChar: "🃞",
    image: "",
  },
  AC: {
    name: "AC",
    unicodeChar: "🃑",
    image: "",
  },
  "7S": {
    name: "7S",
    unicodeChar: "🂧",
    image: "",
  },
  "8S": {
    name: "8S",
    unicodeChar: "🂨",
    image: "",
  },
  "9S": {
    name: "9S",
    unicodeChar: "🂩",
    image: "",
  },
  "0S": {
    name: "0S",
    unicodeChar: "🂪",
    image: "",
  },
  JS: {
    name: "JS",
    unicodeChar: "🂫",
    image: "",
  },
  QS: {
    name: "QS",
    unicodeChar: "🂭",
    image: "",
  },
  KS: {
    name: "KS",
    unicodeChar: "🂮",
    image: "",
  },
  AS: {
    name: "AS",
    unicodeChar: "🂡",
    image: "",
  },
}

const SUIT_NAMES = {
  D: "♦︎",
  H: "♥︎",
  S: "♠︎",
  C: "♣︎",
}

const SUIT_COLOR = {
  D: "tomato",
  H: "tomato",
  C: "darkslategray",
  S: "darkslategray",
}

const VALUES = {
  7: 7,
  8: 8,
  9: 9,
  0: 10,
  J: 20,
  Q: 10,
  K: 10,
  A: 11,
}

const RANK_VALUE = {
  7: 7,
  8: 8,
  9: 9,
  0: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
}

const CARDS_PER_PLAYER = {
  2: 7,
  3: 6,
  4: 5,
  5: 7,
  6: 6,
  7: 6,
  8: 5,
}

export {
  CARDS_DICT,
  SUIT_NAMES,
  SUIT_COLOR,
  VALUES,
  RANK_VALUE,
  CARDS_PER_PLAYER,
}
