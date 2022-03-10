<script>
  import { createEventDispatcher } from "svelte"
  import { scale } from "svelte/transition"
  import {
    _7active,
    _8active,
    _7sPlayed,
    userPlayedJack,
  } from "../stores/game.js"
  import { SUIT_COLOR, SUIT_NAMES } from "../assets/carddata.js"

  const dispatch = createEventDispatcher()

  function drawCards(amount) {
    dispatch("drawCards", {
      amount,
    })
  }

  function missTurn() {
    dispatch("missTurn")
  }

  function wish(suit) {
    dispatch("wish", {
      suit,
    })
  }
</script>

<div class="user-controls" transition:scale>
  {#if $_7active}
    <button class="btn btn-control" on:click={drawCards($_7sPlayed * 2)}
      >{$_7sPlayed * 2} ziehen</button
    >
  {:else if $_8active}
    <button class="btn btn-control" on:click={missTurn}>Aussetzen</button>
  {:else if $userPlayedJack}
    <div class="wish-controls">
      {#each Object.entries(SUIT_NAMES) as suit}
        <button
          class="btn"
          style:color={SUIT_COLOR[suit[0]]}
          on:click={() => wish(suit[0])}
        >
          {suit[1]}
        </button>
      {/each}
    </div>
  {:else}
    <button class="btn btn-control" on:click={() => drawCards(1)}>
      Karte ziehen
    </button>
  {/if}
</div>

<style>
  .user-controls {
    grid-column: 2;
    grid-row: 4;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .btn-control {
    font-size: 0.8rem;
    color: forestgreen;
    background-color: #fff;
  }

  .wish-controls {
    grid-column: 2;
    grid-row: 4;
    display: flex;
    gap: 0.75em;
  }

  .wish-controls > button {
    padding: 0.2em 0.5em;
    font-size: 1.5rem;
    background-color: #fff;
  }
</style>
