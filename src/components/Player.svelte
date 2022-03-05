<script>
  // import { onMount, afterUpdate } from "svelte"
  import { noOfPlayers } from "../stores/settings.js"
  import { currentPlayer } from "../stores/game.js"
  import { SUIT_COLOR } from "../assets/cardrefs.js"

  const SUITS = [...Object.keys(SUIT_COLOR)]

  // function sortHand(handArray) {
  //   let sortedHand = []
  //   SUITS.forEach((suit) => {
  //     let filteredSuits = handArray.filter((card) => card[1] === suit)
  //     filteredSuits.sort(
  //       (cardA, cardB) => RANK_VALUE[cardA] - RANK_VALUE[cardB]
  //     )
  //     sortedHand = sortedHand.concat(filteredSuits)
  //   })
  //   return sortedHand
  // }

  export let playerId = ""
  export let playerName = ""
  export let playerHand
  export let playerIndex = 0
  export let userIndex = 0

  function posAtTable() {
    if (playerIndex === userIndex) {
      return "player-user"
    }

    const FAC_00 = 1 - userIndex
    const FAC_01 = $noOfPlayers - 1
    const FAC_02 = -FAC_01 + userIndex

    if (userIndex === $noOfPlayers - $noOfPlayers) {
      // user == first
      if (-playerIndex === -FAC_00) {
        return "player-left"
      }
      if (-playerIndex === FAC_02) {
        return "player-right"
      }
      return "player-opposite"
    }

    if (userIndex === FAC_01) {
      // user == last
      if (-playerIndex === FAC_00) {
        return "player-right"
      }
      if (playerIndex === FAC_02) {
        return "player-left"
      }
      return "player-opposite"
    }

    if (userIndex === 1) {
      if (playerIndex === 2) {
        return "player-left"
      }
      if (playerIndex === 0) {
        return "player-right"
      }
      if (playerIndex === 3) {
        return "player-opposite"
      }
    }

    if (userIndex === 2) {
      if (playerIndex === 3) {
        return "player-left"
      }
      if (playerIndex === 1) {
        return "player-right"
      }
      if (playerIndex === 0) {
        return "player-opposite"
      }
    }
  }

  // afterUpdate(() => {
  //   if ($sortUserCards && playerIndex === userIndex) {
  //     playerHand = sortHand(playerHand)
  //   }
  // })
</script>

<div class="player {posAtTable()}">
  <div
    class="player-hand"
    style:grid-template-columns={`repeat(${playerHand.length + 1}, 1fr)`}
  >
    <slot />
  </div>
  <div
    class="player-name"
    style:color={$currentPlayer.playerId === playerId ? "blue" : ""}
    style:font-weight={$currentPlayer.playerId === playerId ? 700 : 400}
  >
    {playerName}
  </div>
</div>

<style>
  .player {
    display: grid;
    row-gap: 0.5rem;
  }

  .player-user {
    grid-column: 1 / -1;
    grid-row: 3;
    align-self: end;
    justify-self: start;
  }

  .player-left {
    grid-column: 1;
    grid-row: 2;
    place-self: start;
  }

  .player-right {
    grid-column: 3;
    grid-row: 2;
    place-self: end;
  }

  /* .player-left .player-name {
    transform: rotate(90deg);
  }

  .player-right .player-name {
    transform: rotate(-90deg);
  } */

  .player-opposite {
    grid-column: 2 / 3;
    grid-row: 1;
    place-self: start;
  }

  .player-hand {
    display: grid;
    row-gap: 0.5rem;
    width: fit-content;
    /* height: fit-content; */
  }

  .player-name {
    grid-row: 2;
    place-self: start;
    white-space: nowrap;
    /* margin-top: 0.5em; */
  }
</style>
