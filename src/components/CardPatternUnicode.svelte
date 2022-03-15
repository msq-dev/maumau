<script>
  import { onMount } from "svelte"
  import { CARDS_DICT, SUIT_COLOR } from "../assets/carddata.js"

  export let card
  export let pileCard = false
  export let userCard = false

  const cardProperties = {
    pile: {
      font: "120px monospace",
      width: 83,
      height: 105,
      textPosY: 85,
      face: CARDS_DICT[card].unicodeChar,
      color: SUIT_COLOR[card[1]],
    },
    user: {
      font: "175px monospace",
      width: 120,
      height: 150,
      textPosY: 121,
      face: CARDS_DICT[card].unicodeChar,
      color: SUIT_COLOR[card[1]],
    },
    npc: {
      font: "100px monospace",
      width: 73,
      height: 99,
      textPosY: 77,
      face: "🂠",
      color: "darkblue",
    },
  }

  let cardprops
  if (pileCard) {
    cardprops = cardProperties.pile
  } else if (userCard) {
    cardprops = cardProperties.user
  } else {
    cardprops = cardProperties.npc
  }

  let canvas

  onMount(() => {
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = cardprops.color
    ctx.font = cardprops.font
    ctx.fillText(cardprops.face, 0, cardprops.textPosY)
  })
</script>

<canvas bind:this={canvas} width={cardprops.width} height={cardprops.height} />

<style>
  canvas {
    background-color: ghostwhite;
    border: 1px solid #000;
    border-radius: 0.3rem;
  }
</style>
