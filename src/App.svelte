<script>
  import { sessionRunning } from "./stores/game.js"
  import Settings from "./components/Settings.svelte"
  import GameTable from "./components/GameTable.svelte"

  let settingsOpen = false

  function closeSettings() {
    settingsOpen = false
  }

  function startSession() {
    sessionRunning.set(true)
  }
</script>

<main style:background-color={$sessionRunning ? "forestgreen" : ""}>
  <Settings {settingsOpen} on:close={closeSettings} />

  {#if $sessionRunning}
    <GameTable />
  {:else}
    <div class="app-title">Mau<span>Mau</span></div>
    <button class="btn btn-start" on:click={() => startSession()}
      >Zum Tisch</button
    >
    <button class="btn btn-settings" on:click={() => (settingsOpen = true)}
      >Einstellungen</button
    >
  {/if}
</main>

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .app-title {
    font-size: 3rem;
    font-weight: 700;
    color: tomato;
    margin-bottom: 1em;
  }

  .app-title > span {
    color: darkslategray;
  }

  :global(.btn) {
    padding: 0.25em 0.75em;
    border-radius: 0.5em;
  }

  .btn-start {
    margin-bottom: 2em;
    color: #fff;
    background-color: forestgreen;
  }

  .btn-settings {
    background-color: gainsboro;
  }
</style>
