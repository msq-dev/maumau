import { RANK_VALUE, SUIT_NAMES } from "../assets/carddata.js"
import { mode } from "./arrayutils.js"

function sortHand(handArray) {
  let sortedHand = []
  Object.keys(SUIT_NAMES).forEach((suit) => {
    let filteredSuits = handArray.filter((card) => card[1] === suit)
    filteredSuits.sort((cardA, cardB) => {
      return RANK_VALUE[cardA] - RANK_VALUE[cardB]
    })
    sortedHand = sortedHand.concat(filteredSuits)
  })
  return sortedHand
}

function drawFrom(deckArray, random = false) {
  if (!random) {
    return deckArray.pop()
  }
  const index = Math.floor(Math.random() * deckArray.length)
  return deckArray.splice(index, 1)[0]
}

function calculateWish(hand) {
  const handWithoutJacks = hand.filter((card) => card[0] !== "J")
  const wish = mode(handWithoutJacks.map((card) => card[1])) ?? "H"
  return wish
}

export { sortHand, drawFrom, calculateWish }
