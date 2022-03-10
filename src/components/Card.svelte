<script>
  import { createEventDispatcher } from "svelte"
  import { pattern } from "../stores/settings.js"
  import { currentPlayer, currentCard } from "../stores/game.js"
  import { CARDS_DICT, SUIT_COLOR } from "../assets/carddata.js"

  export let card
  export let pileCard = false
  export let userCard = false

  const unicodeCard = $pattern === "unicode"
  const frenchCard = $pattern === "french"
  const npcCard = !pileCard
  const cardBack = "🂠"

  let cardElement

  const dispatch = createEventDispatcher()
  function playCard() {
    dispatch("userPlayedCard", {
      card,
      cardElement,
    })
  }
</script>

{#if userCard}
  <div
    class="playing-card user-card"
    class:pileCard
    class:unicodeCard
    class:frenchCard
    style:opacity={!$currentPlayer.isUser ? "1" : ""}
    style:color={SUIT_COLOR[card[1]]}
    style:background-position={`-${CARDS_DICT[card].spriteCoords.x}px -${CARDS_DICT[card].spriteCoords.y}px`}
    bind:this={cardElement}
    on:click={playCard}
  >
    {unicodeCard ? CARDS_DICT[card].unicodeChar : ""}
  </div>
{:else}
  <div
    class="playing-card"
    class:pileCard
    class:npcCard
    class:unicodeCard
    class:frenchCard
    style:color={pileCard && unicodeCard ? SUIT_COLOR[card[1]] : "darkblue"}
    style:background-position={pileCard && frenchCard
      ? `-${CARDS_DICT[card].spriteCoords.x}px -${CARDS_DICT[card].spriteCoords.y}px`
      : ""}
    style:filter={pileCard && frenchCard && $currentCard === card
      ? "drop-shadow(0 0 0.3em rgb(0 0 0 / 0.4))"
      : ""}
  >
    {#if pileCard}
      {unicodeCard ? CARDS_DICT[card].unicodeChar : ""}
    {:else}
      {cardBack}
    {/if}
  </div>
{/if}

<style>
  .playing-card {
    position: relative;
    isolation: isolate;
    font-size: 3rem;
    font-family: monospace;
    line-height: 1;
  }

  .pileCard.unicodeCard::before,
  .user-card.unicodeCard::before,
  .npcCard::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    display: inline-block;
    transform: translate(1%, 16%);
    width: 98%;
    height: 88%;
    background-color: ghostwhite;
    border: 1px solid #000;
    border-radius: 5px;
  }

  .pileCard.unicodeCard,
  .user-card.unicodeCard {
    font-size: 7rem;
  }

  .pileCard.frenchCard,
  .user-card.frenchCard {
    width: 118px;
    height: 181px;
    background-image: url("../publicassets/french.jpg");
    transform: scale(0.65);
    border-radius: 10px;
  }

  .pileCard.frenchCard {
    transform-origin: top left;
  }

  .user-card.frenchCard {
    transform-origin: bottom left;
    filter: drop-shadow(-0.1em 0 0.1em rgb(0 0 0 / 0.4));
  }
</style>
