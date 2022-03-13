<script>
  import { createEventDispatcher } from "svelte"
  import { fly } from "svelte/transition"

  import {
    _7on7,
    _8on8,
    noJackOnJack,
    additionalCardAfterAce,
    penaltyLastCard,
  } from "../stores/rules.js"
  import {
    username,
    sortUserCards,
    countPoints,
    aggressionLevel,
    noOfPlayers,
    cardsPerPlayer,
    npcSpeed,
    pattern,
  } from "../stores/settings.js"
  import Checkbox from "./Checkbox.svelte"

  export let settingsOpen = false

  const dispatch = createEventDispatcher()

  function close() {
    dispatch("close")
  }
</script>

{#if settingsOpen}
  <div class="settings-container" transition:fly={{ opacity: 1, y: -1000 }}>
    <h3 class="headline-rules">Regeln</h3>
    <Checkbox checkboxName={"_7on7"} bind:val={$_7on7}>7 auf 7 erlaubt</Checkbox
    >
    <Checkbox checkboxName={"_8on8"} bind:val={$_8on8}>8 auf 8 erlaubt</Checkbox
    >
    <Checkbox checkboxName={"noJackonJack"} bind:val={$noJackOnJack}
      >Bube auf Bube stinkt</Checkbox
    >
    <!-- <Checkbox checkboxName={"penaltyLastCard"} bind:val={$penaltyLastCard}
      >Strafe für "Letzte Karte" vergessen</Checkbox
    > -->
    <!-- <Checkbox
      checkboxName={"additionalCardAfterAce"}
      bind:val={$additionalCardAfterAce}>nach Ass Zusatzkarte legen</Checkbox
    > -->

    <h3 class="headline-settings">Einstellungen</h3>
    <input type="text" bind:value={$username} />

    <Checkbox checkboxName={"sortUserCards"} bind:val={$sortUserCards}
      >meine Karten sortieren</Checkbox
    >
    <Checkbox checkboxName={"countPoints"} bind:val={$countPoints}
      >Punkte zählen</Checkbox
    >

    <input
      type="range"
      id="aggression"
      bind:value={$aggressionLevel}
      min="0"
      max="2"
    />
    <label for="aggression">
      Aggressionslevel: {$aggressionLevel}
    </label>

    <!-- <input
      id="noOfPlayers"
      type="range"
      bind:value={$noOfPlayers}
      min="2"
      max="8"
    /> -->
    <label for="noOfPlayers"
      >Anzahl Spieler: {$noOfPlayers} <br />
      <small>(entspr. {$cardsPerPlayer} Karten/Spieler)</small>
    </label>

    <input
      type="range"
      id="speed"
      bind:value={$npcSpeed}
      min="100"
      max="3000"
      step="10"
    />
    <label for="speed">
      Geschwindigkeit: {$npcSpeed}&#8239;ms
    </label>

    <div class="radio-group">
      <input id="french" type="radio" bind:group={$pattern} value={"french"} />
      <label for="french"> Französisches Bild</label>
    </div>

    <div class="radio-group">
      <input
        id="unicode"
        type="radio"
        bind:group={$pattern}
        value={"unicode"}
      />
      <label for="unicode">Unicode-Bild</label>
    </div>

    <button class="btn btn-close" on:click={close}>Schließen</button>
  </div>
{/if}

<style>
  .settings-container {
    position: absolute;
    z-index: 5;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 1em;
    height: fit-content;
    background-color: #fff;
  }

  .headline-settings {
    margin-top: 1em;
  }

  input[type="text"] {
    padding: 0.5em;
    margin-bottom: 1em;
  }

  input[type="range"] {
    margin-top: 0.5em;
  }

  input[type="range"] ~ label {
    margin-bottom: 1em;
  }

  .radio-group {
    display: flex;
    gap: 0.5em;
  }

  .radio-group:last-of-type {
    margin-bottom: 1em;
  }

  .btn-close {
    background-color: gainsboro;
    margin-bottom: 1em;
  }
</style>
