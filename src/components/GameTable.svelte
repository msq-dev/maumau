<script>
  import { onMount } from "svelte"
  import { flip } from "svelte/animate"
  import { scale, crossfade } from "svelte/transition"
  import { expoOut } from "svelte/easing"
  import { v4 as uuidv4 } from "uuid"

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
    noOfPlayers,
    noOfDecks,
    cardsPerPlayer,
    aggressionLevel,
    npcSpeed,
  } from "../stores/settings.js"

  import {
    pileDiscard,
    currentCard,
    currentPlayer,
    sessionRunning,
    _7active,
    _8active,
    _7sPlayed,
    userPlayedJack,
  } from "../stores/game.js"

  import { shuffle } from "../utils/arrayutils.js"
  import { sortHand, drawFrom, calculateWish } from "../utils/gameutils.js"
  import {
    CARDS_DICT,
    VALUES,
    SUIT_NAMES,
    SUIT_COLOR,
  } from "../assets/carddata.js"

  import Player from "./Player.svelte"
  import Card from "./Card.svelte"
  import UserControls from "./UserControls.svelte"
  import ChatMessage from "./ChatMessage.svelte"

  const CARDS = Object.keys(CARDS_DICT)

  let demandedSuit

  let gameRunning
  let winner

  let showControlsUser

  let pileStock = []
  let chatMessages = []
  let players = []

  let userIndex
  let cardDeck

  function setupGame() {
    $_7sPlayed = 0
    $_7active = false
    $_8active = false
    $userPlayedJack = false
    $pileDiscard = []

    demandedSuit = ""
    gameRunning = false
    winner = null
    showControlsUser = false

    pileStock = []
    chatMessages = []

    cardDeck = $noOfDecks === 2 ? CARDS.concat(CARDS) : CARDS

    players.forEach((p) => {
      p.playerHand = []
      for (let i = 0; i < $cardsPerPlayer; i++) {
        p.playerHand.push(drawFrom(cardDeck, true))
      }
      if (p.isUser && $sortUserCards) {
        p.playerHand = sortHand(p.playerHand)
      }
    })

    $pileDiscard = [...$pileDiscard, drawFrom(cardDeck, true)]

    pileStock = shuffle(cardDeck)

    updateCurrentPlayer(players[0])
  }

  onMount(() => {
    players = []
    userIndex = Math.floor(Math.random() * $noOfPlayers)

    let playersArray = []
    for (let i = 0; i < $noOfPlayers; i++) {
      const p = {
        playerId: uuidv4(),
        playerHand: [],
        playerName: i === userIndex ? $username : `Spieler 0${i + 1}`,
        playerIndex: i,
        isUser: i === userIndex,
      }
      playersArray.push(p)
    }

    players = playersArray
    setupGame()
  })

  function startPlaying() {
    gameRunning = true
    if ($currentPlayer.isUser) {
      moveUser()
      return
    }
    takeTurns()
  }

  async function takeTurns() {
    showControlsUser = false
    while (gameRunning) {
      await npcMove()
      if ($currentPlayer.isUser) {
        break
      }
    }
    moveUser()
  }

  function npcMove() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(moveNpc())
      }, $npcSpeed)
    })
  }

  function moveUser() {
    if (!winner) {
      showControlsUser = true
    }
  }

  function userDrawingCards(event) {
    $_7sPlayed = 0
    $_7active = false
    const amount = event.detail.amount

    for (let i = 0; i < amount; i++) {
      drawCard()
      players = players
    }
    nextPlayer()
    takeTurns()
  }

  function userMissingTurn() {
    $_8active = false
    nextPlayer()
    takeTurns()
  }

  function handleUserCard(event) {
    if (!gameRunning) return

    const userCard = event.detail.card
    const cardElement = event.detail.cardElement

    if (!isAllowed(userCard)) {
      disableCard()
    } else {
      playCard(userCard)
      if (!$userPlayedJack) {
        nextPlayer()
        takeTurns()
      }
    }

    function isAllowed(card) {
      const currentRank = $currentCard[0]
      const currentSuit = demandedSuit || $currentCard[1]

      if (currentRank === "J" && !demandedSuit) return true

      if ($_7active) {
        if ($_7on7 && card[0] === "7") {
          return true
        }
        return false
      }

      if ($_8active) {
        if ($_8on8 && card[0] === "8") {
          return true
        }
        return false
      }

      if (card[0] === "J") {
        if (currentRank === "J" && $noJackOnJack) {
          return false
        }
        return true
      }

      if (card[0] === currentRank || card[1] === currentSuit) {
        return true
      }

      return false
    }

    function disableCard() {
      cardElement.style.opacity = 0.3
    }
  }

  function handleWish(event) {
    $userPlayedJack = false
    demandedSuit = event.detail.suit
    nextPlayer()
    takeTurns()
  }

  function moveNpc() {
    const hand = $currentPlayer.playerHand
    const currentRank = $currentCard[0]
    const currentSuit = demandedSuit || $currentCard[1]

    if ($_7active) {
      handle_7()
      nextPlayer()
    } else if ($_8active) {
      handle_8()
      nextPlayer()
    } else {
      handle_regular()
      nextPlayer()
    }
    players = players

    function handle_7() {
      $_7active = false
      if (!$_7on7) {
        sendChatMessage(`du arsch >:(`)

        for (let i = 0; i < 2; i++) {
          drawCard()
        }
        return
      }
      const _7sInHand = hand.filter((card) => card[0] === "7")
      if (!_7sInHand.length) {
        sendChatMessage(`oh no ich muss ${$_7sPlayed * 2} ziehen! fml`)

        for (let i = 0; i < $_7sPlayed * 2; i++) {
          drawCard()
        }
        $_7sPlayed = 0
        return
      }
      playCard(_7sInHand[0])
    }

    function handle_8() {
      $_8active = false
      if (!$_8on8) {
        sendChatMessage(`du arsch >:(`)
        return
      }
      const _8sInHand = hand.filter((card) => card[0] === "8")
      if (!_8sInHand.length) {
        sendChatMessage(`du arsch >:(`)
        return
      }
      playCard(_8sInHand[0])
    }

    function handle_regular() {
      const jacksInHand = hand.filter((card) => card[0] === "J")
      const handWithoutJacks = hand.filter((card) => card[0] !== "J")

      const options = playableCards(currentRank, currentSuit, handWithoutJacks)

      if (!options.length && !jacksInHand.length) {
        sendChatMessage(`ich hab nix :(`)
        drawCard()
        return
      }
      if (!options.length && currentRank === "J" && $noJackOnJack) {
        sendChatMessage(`ich hab nix :(`)
        drawCard()
        return
      }
      if (!options.length) {
        playCard(jacksInHand[0])
        return
      }

      let isAggressive = 0
      if ($aggressionLevel === 1) {
        isAggressive = Math.round(Math.random())
      } else if ($aggressionLevel === 2) {
        isAggressive = 1
      }

      let aggressiveCards = options.filter((c) => c.value <= 8)

      if (aggressiveCards.length && isAggressive) {
        playCard(aggressiveCards[0].card)
      } else {
        options.sort((a, b) =>
          a.value > b.value ? 1 : b.value > a.value ? -1 : 0
        )
        playCard(options[options.length - 1].card)
      }
    }
  }

  function playableCards(rank, suit, withoutJacks) {
    let cardsWithValues

    if ($currentCard[0] === "J" && !demandedSuit) {
      cardsWithValues = withoutJacks.map((card) => {
        return { card, value: VALUES[card[0]] }
      })
      return cardsWithValues
    } else {
      cardsWithValues = withoutJacks.reduce((handCards, card) => {
        if (card[0] === rank || card[1] === suit) {
          const cardWithValue = { card, value: VALUES[card[0]] }
          handCards.push(cardWithValue)
        }
        return handCards
      }, [])
      return cardsWithValues
    }
  }

  // Basic game functions
  function playCard(card) {
    demandedSuit = ""

    const hand = $currentPlayer.playerHand
    const playedCard = hand.indexOf(card)
    const isUser = $currentPlayer.isUser

    $pileDiscard = [...$pileDiscard, hand.splice(playedCard, 1)[0]]
    players = players

    if (hand.length === 0) {
      sendChatMessage(`hurra! GEWONNEN!!`)
      handleWin()
      return
    }

    if (hand.length === 1 && !isUser) {
      sendChatMessage(`letzte karte :P`)
    }

    if (card[0] === "7") {
      $_7sPlayed += 1
      $_7active = true
    }
    if (card[0] === "8") {
      $_8active = true
    }
    if (card[0] === "J") {
      if (isUser) {
        $userPlayedJack = true
        return
      }
      demandedSuit = calculateWish(hand)
      sendChatMessage(`ich wünsch mir ${SUIT_NAMES[demandedSuit]}`)
    }
  }

  function drawCard() {
    if (!pileStock.length) {
      const newPileStock = $pileDiscard.splice(0, $pileDiscard.length - 1)
      pileStock = shuffle(newPileStock)
    }

    $currentPlayer.playerHand = [
      ...$currentPlayer.playerHand,
      drawFrom(pileStock),
    ]

    if ($currentPlayer.isUser && $sortUserCards) {
      $currentPlayer.playerHand = sortHand($currentPlayer.playerHand)
    }
  }

  function nextPlayer() {
    if (gameRunning) {
      const next = players.indexOf($currentPlayer) + 1
      if (next === players.length) {
        updateCurrentPlayer(players[0])
      } else {
        updateCurrentPlayer(players[next])
      }
    }
  }

  function handleWin() {
    gameRunning = false
    winner = $currentPlayer
  }

  // Chat function
  function sendChatMessage(m) {
    const messageObject = {
      sender: $currentPlayer,
      content: m,
    }
    chatMessages = [...chatMessages, messageObject]
  }

  // Store functions
  function updateCurrentPlayer(player) {
    currentPlayer.update((p) => player)
  }

  function endSession() {
    pileDiscard.set([])
    currentPlayer.set({})
    sessionRunning.set(false)
  }

  // Animations
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 1000),
    easing: expoOut,
  })
</script>

<div class="game-table" transition:scale>
  <button class="btn btn-quit" on:click={() => endSession()}>Beenden</button>

  {#if winner}
    <div class="winner-screen" transition:scale>
      <h1>{winner.playerName} hat gewonnen!</h1>
      <!-- <button class="btn" on:click={() => setupGame()}>neues Spiel</button> -->
      <button class="btn" on:click={() => endSession()}>Beenden</button>
    </div>
  {/if}

  <div class="pile-container">
    {#if demandedSuit}
      <div
        class="demanded-suit"
        style:color={SUIT_COLOR[demandedSuit]}
        transition:scale
      >
        {SUIT_NAMES[demandedSuit]}
      </div>
    {/if}

    <div class="pile-discard">
      {#each $pileDiscard as card (card)}
        <div
          class="pile-item"
          style:transform={`rotate(${
            Math.random() * 7 * (Math.random() < 0.5 ? -1 : 1)
          }deg)`}
          animate:flip={{ duration: 100 }}
          in:receive={{ key: card }}
          out:send={{ key: card }}
        >
          <Card {card} pileCard={true} />
        </div>
      {/each}
    </div>
  </div>

  {#each players as p}
    <Player {...p} {userIndex}>
      {#each p.playerHand as card, index (card)}
        <div
          class="hand-item"
          style:grid-column={`${index + 1} / span 2`}
          animate:flip={{ duration: 100 }}
          in:receive={{ key: card }}
          out:send={{ key: card }}
        >
          <Card {card} userCard={p.isUser} on:userPlayedCard={handleUserCard} />
        </div>
      {/each}
    </Player>
  {/each}

  <div class="chat-container">
    {#each chatMessages as message}
      <ChatMessage {...message} />
    {/each}
  </div>

  {#if showControlsUser}
    <UserControls
      on:drawCards={userDrawingCards}
      on:missTurn={userMissingTurn}
      on:wish={handleWish}
    />
  {/if}

  {#if !gameRunning && !winner}
    <button class="btn btn-play" on:click={startPlaying} transition:scale
      >Spielen</button
    >
  {/if}
</div>

<style>
  .game-table {
    display: grid;
    place-items: center;
    grid-template-columns: 5rem 8rem 5rem;
    grid-template-rows: 5rem 10rem 10rem 2rem;
    gap: 1em;
    height: 100%;
    padding: 1em;
    background-color: forestgreen;
  }

  .pile-container {
    place-self: center;
    grid-column: 2;
    grid-row: 2;
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .pile-discard {
    position: absolute;
    top: 15%;
    left: 25%;
  }

  .pile-item {
    position: absolute;
  }

  .demanded-suit {
    z-index: 50;
    font-size: 10rem;
    opacity: 0.8;
    mix-blend-mode: hard-light;
  }

  .hand-item {
    grid-row: 1;
  }

  .chat-container {
    position: absolute;
    right: -8px;
    top: 15vmin;
    width: 65%;
  }

  .btn-play {
    grid-column: 2;
    grid-row: 4;
    font-size: 0.8rem;
    color: forestgreen;
    background-color: #fff;
  }

  .btn-quit {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 0.8rem;
    color: #fff;
    background-color: tomato;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .winner-screen {
    position: absolute;
    inset: 0;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    text-align: center;
    padding: 1em;
    margin: 1em;
    background-color: #0006;
    border-radius: 1em;
  }

  .winner-screen > h1 {
    color: #fff;
  }
</style>
