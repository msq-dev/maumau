<script>
  import { createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"

  const dispatch = createEventDispatcher()

  export let mustDrawCards
  export let amountOfSevens
  export let missesTurn

  function drawCards(amount) {
    dispatch("drawCards", {
      amount,
    })
  }

  function missTurn() {
    dispatch("missTurn")
  }
</script>

<div class="user-controls" transition:fade>
  {#if mustDrawCards}
    <button class="btn btn-control" on:click={drawCards(amountOfSevens * 2)}
      >{amountOfSevens * 2} ziehen</button
    >
  {:else if missesTurn}
    <button class="btn btn-control" on:click={missTurn}>Aussetzen</button>
  {:else}
    <button class="btn btn-control" on:click={() => drawCards(1)}>
      Karte ziehen
    </button>
  {/if}
</div>

<style>
  .user-controls {
    /* position: absolute;
    bottom: 1em; */
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
</style>
