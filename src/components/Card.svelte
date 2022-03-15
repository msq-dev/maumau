<script>
  import { createEventDispatcher } from "svelte"
  import { pattern } from "../stores/settings.js"
  import { currentPlayer } from "../stores/game.js"

  import CardPatternFrench from "./CardPatternFrench.svelte"
  import CardPatternUnicode from "./CardPatternUnicode.svelte"

  const cardPattern = {
    french: CardPatternFrench,
    unicode: CardPatternUnicode,
  }

  export let card
  export let pileCard = false
  export let userCard = false

  let cardElement

  const dispatch = createEventDispatcher()
  function playCard() {
    dispatch("userPlayedCard", {
      card,
      cardElement,
    })
  }
</script>

<div
  style:opacity={!$currentPlayer.isUser ? "1" : ""}
  bind:this={cardElement}
  on:click={playCard}
>
  <svelte:component this={cardPattern[$pattern]} {card} {userCard} {pileCard} />
</div>
