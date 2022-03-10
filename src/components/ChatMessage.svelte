<script>
  import { onMount } from "svelte"
  import { fade, scale } from "svelte/transition"

  const PLAYER_CLR = [
    "mediumvioletred",
    "fuchsia",
    "mediumblue",
    "firebrick",
    "darkorange",
  ]

  export let sender
  export let content

  let showMessage = false

  const LIFETIME = 3000

  onMount(() => {
    showMessage = true
    setTimeout(() => {
      showMessage = false
    }, LIFETIME)
  })
</script>

{#if showMessage}
  <div class="chat-message" in:scale out:fade>
    <span style:color={PLAYER_CLR[sender.playerIndex]} style:font-weight="700"
      >{sender.playerName}:
    </span>&nbsp;{content}
  </div>
{/if}

<style>
  .chat-message {
    font-size: 0.8rem;
    color: #000;
    background-color: #ccdeffde;
    padding: 1em;
    border-radius: 7px;
    margin-bottom: 1em;
  }
</style>
