import { writable, derived } from "svelte/store"

export const sessionRunning = writable(true)
export const pileDiscard = writable([])
export const currentCard = derived(
  pileDiscard,
  ($pileDiscard) => $pileDiscard[$pileDiscard.length - 1]
)
export const _7active = writable(false)
export const _7sPlayed = writable(0)
export const _8active = writable(false)

export const userPlayedJack = writable(false)

export const currentPlayer = writable({})
