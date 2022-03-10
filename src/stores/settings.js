import { writable, derived } from "svelte/store"
import { CARDS_PER_PLAYER } from "../assets/carddata.js"

export const username = writable("Userino")
export const sortUserCards = writable(true)
export const countPoints = writable(true)
export const aggressionLevel = writable(2)
export const npcSpeed = writable(1000)
export const noOfPlayers = writable(4)
export const noOfDecks = derived(noOfPlayers, ($noOfPlayers) =>
  $noOfPlayers > 4 ? 2 : 1
)
export const cardsPerPlayer = derived(noOfPlayers, ($noOfPlayers) => {
  return CARDS_PER_PLAYER[String($noOfPlayers)]
})

export const pattern = writable("unicode")
