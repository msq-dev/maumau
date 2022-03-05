import { writable } from "svelte/store"

export const sessionEnded = writable(false)
export const thePlayers = writable([])
export const currentCard = writable("")
export const currentPlayer = writable({})
