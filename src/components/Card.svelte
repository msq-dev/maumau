<script>
  import { onMount, createEventDispatcher } from "svelte"
  import { currentPlayer } from "../stores/game.js"
  import { CARDS_DICT, SUIT_COLOR } from "../assets/cardrefs.js"
  import { pattern } from "../stores/settings.js"

  export let card
  export let isPileCard = false
  export let isUserCard = false

  const dispatch = createEventDispatcher()
  let cardInstance

  function playCard() {
    dispatch("userPlayedCard", {
      card,
      cardInstance,
    })
  }

  // let canvasCard

  // onMount(() => {
  //   if ($pattern === "french" && isUserCard) {
  //     let src = "publicassets/french.jpg"
  //     const frenchCards = new Image()
  //     frenchCards.src = src
  //     const ctx = canvasCard.getContext("2d")
  //     frenchCards.onload = () =>
  //       ctx.drawImage(frenchCards, 30, 30, 140, 184, 0, 0, 118 / 2, 184 / 2)
  //   }
  // })
</script>

{#if $pattern === "unicode"}
  {#if !isUserCard}
    <div
      class="playing-card"
      style:font-size={isPileCard ? "7rem" : "3rem"}
      style:color={isPileCard ? SUIT_COLOR[card[1]] : "darkblue"}
    >
      {isPileCard ? CARDS_DICT[card].unicodeChar : "🂠"}
    </div>
  {:else}
    <div
      class="playing-card"
      style:font-size={"7rem"}
      style:color={SUIT_COLOR[card[1]]}
      style:opacity={!$currentPlayer.isUser ? "1" : ""}
      bind:this={cardInstance}
      on:click={playCard}
    >
      {CARDS_DICT[card].unicodeChar}
    </div>
  {/if}
  <!-- {:else if $pattern === "french"}
  {#if !isUserCard}
    <div class="canvas-playing-card">
      <canvas class="" />
    </div>
  {:else}
    <canvas class="canvas-user" bind:this={canvasCard} />
  {/if} -->
{/if}

<style>
  .playing-card {
    position: relative;
    isolation: isolate;
    font-family: monospace;
    line-height: 1;
  }

  .playing-card::before {
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
</style>
