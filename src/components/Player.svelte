<script>
  import { noOfPlayers } from "../stores/settings.js"
  import { currentPlayer } from "../stores/game.js"

  export let playerId
  export let playerName
  export let playerHand
  export let playerIndex
  export let userIndex
  export let isUser

  $: isCurrentPlayer = $currentPlayer.playerId === playerId

  function posAtTable() {
    if (isUser) {
      return "player-user"
    }

    const userNeighbor_01 = 1 - userIndex
    const userNeighbor_02 = -($noOfPlayers - 1) + userIndex

    // user == first
    if (userIndex === $noOfPlayers - $noOfPlayers) {
      if (-playerIndex === -userNeighbor_01) {
        return "player-left"
      }
      if (-playerIndex === userNeighbor_02) {
        return "player-right"
      }
      return "player-opposite"
    }

    // user == last
    if (userIndex === $noOfPlayers - 1) {
      if (-playerIndex === userNeighbor_01) {
        return "player-right"
      }
      if (playerIndex === userNeighbor_02) {
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
</script>

<div class="player {posAtTable()}">
  <div
    class="player-hand"
    style:grid-template-columns={`repeat(${playerHand.length + 1}, 1fr)`}
  >
    <slot />
  </div>
  <div class="player-name" class:isCurrentPlayer>
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
    place-self: center;
    margin-bottom: 1.5em;
  }

  .player-right {
    grid-column: 3;
    grid-row: 2;
    place-self: end;
  }

  .player-opposite {
    grid-column: 2 / 3;
    grid-row: 1;
    place-self: start;
  }

  .player-hand {
    display: grid;
    row-gap: 0.5rem;
  }

  .player-left > .player-hand,
  .player-right > .player-hand,
  .player-opposite > .player-hand {
    height: 4rem;
    width: 5rem;
  }

  .player-user > .player-hand {
    width: fit-content;
  }

  .player-name {
    grid-row: 2;
    place-self: start;
    white-space: nowrap;
  }

  .isCurrentPlayer {
    color: blue;
    font-weight: 700;
  }
</style>
