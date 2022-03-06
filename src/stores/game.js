import { writable } from "svelte/store"

export const sessionRunning = writable(true)
export const thePlayers = writable([])
export const currentCard = writable("")
export const currentPlayer = writable({})
