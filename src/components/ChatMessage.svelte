<script>
  import { onMount } from "svelte"
  import { fade, fly } from "svelte/transition"

  export let senderName
  export let senderColor
  export let text

  let showMessage = false

  const LIFETIME = 4000

  onMount(() => {
    showMessage = true
    setTimeout(() => {
      showMessage = false
    }, LIFETIME)
  })
</script>

{#if showMessage}
  <div class="chat-message" in:fly={{ y: 50, duration: 200 }} out:fade>
    <span style:color={senderColor} style:font-weight="700"
      >{senderName}:
    </span>&nbsp;{text}
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
