<script>
  import { CARDS_DICT } from "../assets/carddata.js"
  import { currentCard } from "../stores/game.js"

  export let card
  export let pileCard = false
  export let userCard = false

  const spritePosition = `-${CARDS_DICT[card].spriteCoords.x}px -${CARDS_DICT[card].spriteCoords.y}px`
  const shadow = "drop-shadow(-0.25em 0 0.3em rgb(0 0 0 / 0.5))"

  const isNpcCard = !pileCard && !userCard
  const isCardFront = pileCard || userCard || npcFlipped
  $: npcFlipped = isNpcCard && card === $currentCard
</script>

<div
  class="french-card"
  class:pileCard
  class:userCard
  style:background={isCardFront
    ? `url("../maumau/publicassets/french.jpg")`
    : `url("../maumau/publicassets/card_back.jpg")`}
  style:background-position={isCardFront ? spritePosition : "center"}
  style:background-size={!isCardFront ? "cover" : ""}
  style:filter={userCard || card === $currentCard || isNpcCard ? shadow : ""}
/>

<style>
  .french-card {
    width: 118px;
    height: 181px;
    border-radius: 10px;
    transform: scale(0.35);
    transform-origin: top left;
  }

  .pileCard,
  .userCard {
    transform: scale(0.65);
  }

  .userCard {
    transform-origin: bottom left;
  }
</style>
