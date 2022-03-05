<script>
  import { sessionEnded } from "./stores/game.js"
  import Settings from "./components/Settings.svelte"
  import Game from "./components/Game.svelte"

  let settingsOpen = false

  function closeSettings(event) {
    settingsOpen = event.detail.payload
  }

  function endGame(status) {
    sessionEnded.update((s) => status)
  }
</script>

<main style:background-color={$sessionEnded ? "" : "forestgreen"}>
  <Settings {settingsOpen} on:close={closeSettings} />

  {#if !$sessionEnded}
    <Game />
  {:else}
    <div class="app-title">Mau<span>Mau</span></div>
    <button class="btn btn-start" on:click={() => endGame(false)}
      >Zum Spiel</button
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
    width: 100%;
    height: 100vh;
    margin: 0 auto;
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

  .btn-start {
    margin-bottom: 2em;
    color: #fff;
    background-color: forestgreen;
  }

  .btn-settings {
    background-color: gainsboro;
  }
</style>
