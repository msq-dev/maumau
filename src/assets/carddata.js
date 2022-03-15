const CARDS_DICT = {
  "7D": {
    name: "7D",
    unicodeChar: "🃇",
    spriteCoords: { x: 2, y: 551 },
  },
  "8D": {
    name: "8D",
    unicodeChar: "🃈",
    spriteCoords: { x: 121, y: 551 },
  },
  "9D": {
    name: "9D",
    unicodeChar: "🃉",
    spriteCoords: { x: 240, y: 551 },
  },
  "0D": {
    name: "0D",
    unicodeChar: "🃊",
    spriteCoords: { x: 359, y: 551 },
  },
  JD: {
    name: "JD",
    unicodeChar: "🃋",
    spriteCoords: { x: 478, y: 552 },
  },
  QD: {
    name: "QD",
    unicodeChar: "🃍",
    spriteCoords: { x: 598, y: 552 },
  },
  KD: {
    name: "KD",
    unicodeChar: "🃎",
    spriteCoords: { x: 718, y: 552 },
  },
  AD: {
    name: "AD",
    unicodeChar: "🃁",
    spriteCoords: { x: 837, y: 552 },
  },
  "7H": {
    name: "7H",
    unicodeChar: "🂷",
    spriteCoords: { x: 3, y: 368 },
  },
  "8H": {
    name: "8H",
    unicodeChar: "🂸",
    spriteCoords: { x: 121, y: 368 },
  },
  "9H": {
    name: "9H",
    unicodeChar: "🂹",
    spriteCoords: { x: 240, y: 368 },
  },
  "0H": {
    name: "0H",
    unicodeChar: "🂺",
    spriteCoords: { x: 359, y: 368 },
  },
  JH: {
    name: "JH",
    unicodeChar: "🂻",
    spriteCoords: { x: 478, y: 368 },
  },
  QH: {
    name: "QH",
    unicodeChar: "🂽",
    spriteCoords: { x: 718, y: 368 },
  },
  KH: {
    name: "KH",
    unicodeChar: "🂾",
    spriteCoords: { x: 598, y: 368 },
  },
  AH: {
    name: "AH",
    unicodeChar: "🂱",
    spriteCoords: { x: 838, y: 368 },
  },
  "7C": {
    name: "7C",
    unicodeChar: "🃗",
    spriteCoords: { x: 3, y: 1 },
  },
  "8C": {
    name: "8C",
    unicodeChar: "🃘",
    spriteCoords: { x: 122, y: 1 },
  },
  "9C": {
    name: "9C",
    unicodeChar: "🃙",
    spriteCoords: { x: 241, y: 1 },
  },
  "0C": {
    name: "0C",
    unicodeChar: "🃚",
    spriteCoords: { x: 359, y: 1 },
  },
  JC: {
    name: "JC",
    unicodeChar: "🃛",
    spriteCoords: { x: 479, y: 0 },
  },
  QC: {
    name: "QC",
    unicodeChar: "🃝",
    spriteCoords: { x: 598, y: 1 },
  },
  KC: {
    name: "KC",
    unicodeChar: "🃞",
    spriteCoords: { x: 718, y: 0 },
  },
  AC: {
    name: "AC",
    unicodeChar: "🃑",
    spriteCoords: { x: 838, y: 0 },
  },
  "7S": {
    name: "7S",
    unicodeChar: "🂧",
    spriteCoords: { x: 3, y: 185 },
  },
  "8S": {
    name: "8S",
    unicodeChar: "🂨",
    spriteCoords: { x: 122, y: 185 },
  },
  "9S": {
    name: "9S",
    unicodeChar: "🂩",
    spriteCoords: { x: 241, y: 185 },
  },
  "0S": {
    name: "0S",
    unicodeChar: "🂪",
    spriteCoords: { x: 361, y: 185 },
  },
  JS: {
    name: "JS",
    unicodeChar: "🂫",
    spriteCoords: { x: 480, y: 185 },
  },
  QS: {
    name: "QS",
    unicodeChar: "🂭",
    spriteCoords: { x: 598, y: 185 },
  },
  KS: {
    name: "KS",
    unicodeChar: "🂮",
    spriteCoords: { x: 718, y: 185 },
  },
  AS: {
    name: "AS",
    unicodeChar: "🂡",
    spriteCoords: { x: 838, y: 185 },
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
