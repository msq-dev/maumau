<script>
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
    thePlayers,
    currentCard,
    currentPlayer,
    sessionRunning,
  } from "../stores/game.js"

  import { onMount } from "svelte"
  import { flip } from "svelte/animate"
  import { scale, crossfade, fade } from "svelte/transition"
  import { expoOut } from "svelte/easing"
  import { v4 as uuidv4 } from "uuid"

  import { shuffle, drawFrom, mode } from "../assets/utils.js"
  import {
    CARDS_DICT,
    VALUES,
    RANK_VALUE,
    SUIT_NAMES,
    SUIT_COLOR,
  } from "../assets/cardrefs.js"

  import Player from "./Player.svelte"
  import Card from "./Card.svelte"
  import UserControls from "./UserControls.svelte"
  import ChatMessage from "./ChatMessage.svelte"

  const TIMEOUT = $npcSpeed
  const PLAYER_CLR = [
    "mediumvioletred",
    "mediumblue",
    "firebrick",
    "darkorange",
    "fuchsia",
  ]

  const CARDS = Object.keys(CARDS_DICT)

  let moves

  let _7sPlayed
  let _7active
  let _8active
  let demandedSuit

  let gameRunning
  let winner

  let showControlsUser
  let showControlsWish

  let pileDiscard = []
  let pileStock = []
  let chatMessages = []

  let userIndex
  let cardDeck

  function setupGame() {
    moves = 0
    _7sPlayed = 0
    _7active = false
    _8active = false
    demandedSuit = ""
    gameRunning = false
    winner = null
    showControlsUser = false
    showControlsWish = false

    pileDiscard = []
    pileStock = []
    chatMessages = []

    cardDeck = $noOfDecks === 2 ? CARDS.concat(CARDS) : CARDS

    $thePlayers.forEach((p) => {
      p.playerHand = []
      for (let i = 0; i < $cardsPerPlayer; i++) {
        p.playerHand.push(drawFrom(cardDeck, true))
      }
      if (p.isUser && $sortUserCards) {
        p.playerHand = sortHand(p.playerHand)
      }
    })

    pileDiscard = [...pileDiscard, drawFrom(cardDeck, true)]
    updateCurrentCard(pileDiscard[pileDiscard.length - 1])

    pileStock = shuffle(cardDeck)

    updateCurrentPlayer($thePlayers[0])
  }

  onMount(() => {
    userIndex = Math.floor(Math.random() * $noOfPlayers)

    let players = []
    for (let i = 0; i < $noOfPlayers; i++) {
      const p = {
        playerId: uuidv4(),
        playerHand: [],
        playerName: i === userIndex ? $username : `Spieler 0${i + 1}`,
        playerColor: PLAYER_CLR[i],
        playerIndex: i,
        isUser: i === userIndex,
      }
      players.push(p)
    }

    updateThePlayers(players)
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
      }, TIMEOUT)
    })
  }

  function moveUser() {
    if (!winner) {
      showControlsUser = true
    }
  }

  function userDrawingCards(event) {
    _7sPlayed = 0
    _7active = false
    const amount = event.detail.amount

    for (let i = 0; i < amount; i++) {
      drawCard()
      updateThePlayers($thePlayers)
    }
    nextPlayer()
    takeTurns()
  }

  function userMissingTurn() {
    _8active = false
    nextPlayer()
    takeTurns()
  }

  function handleUserCard(event) {
    if (!gameRunning) return

    const userCard = event.detail.card
    const cardInstance = event.detail.cardInstance

    if (!isAllowed(userCard)) {
      handleForbidden()
    } else {
      playCard(userCard)
      if (!showControlsWish) {
        nextPlayer()
        takeTurns()
      }
    }

    function isAllowed(card) {
      if (moves === 0) return true

      if (_7active) {
        if ($_7on7 && card[0] === "7") {
          return true
        }
        return false
      }

      if (_8active) {
        if ($_8on8 && card[0] === "8") {
          return true
        }
        return false
      }

      const currentRank = $currentCard[0]
      const currentSuit = demandedSuit || $currentCard[1]

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

    function handleForbidden() {
      cardInstance.style.opacity = 0.3
    }
  }

  function handleWish(suit) {
    demandedSuit = suit
    showControlsWish = false
    nextPlayer()
    takeTurns()
  }

  function moveNpc() {
    const hand = $currentPlayer.playerHand
    const currentRank = $currentCard[0]
    const currentSuit = demandedSuit || $currentCard[1]

    if (_7active) {
      handle_7()
      nextPlayer()
    } else if (_8active) {
      handle_8()
      nextPlayer()
    } else {
      handle_regular()
      nextPlayer()
    }

    updateThePlayers($thePlayers)

    ////////////////////////////////////////////////////////////////////

    function handle_7() {
      _7active = false
      if (!$_7on7) {
        sendChatMessage(`du arsch >:(`)

        for (let i = 0; i < 2; i++) {
          drawCard()
        }
        return
      }
      const _7sInHand = hand.filter((card) => card[0] === "7")
      if (!_7sInHand.length) {
        sendChatMessage(`oh no ich muss ${_7sPlayed * 2} ziehen! fml`)

        for (let i = 0; i < _7sPlayed * 2; i++) {
          drawCard()
        }
        _7sPlayed = 0
        return
      }
      playCard(_7sInHand[0])
    }

    function handle_8() {
      _8active = false
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

      let aggressionProbability = 0
      if ($aggressionLevel === 1) {
        aggressionProbability = Math.round(Math.random())
      } else if ($aggressionLevel === 2) {
        aggressionProbability = 1
      }

      let aggressiveCards = options.filter((c) => c.value <= 8)

      if (aggressiveCards.length && aggressionProbability) {
        playCard(aggressiveCards[0].card)
      } else {
        options.sort((a, b) =>
          a.value > b.value ? 1 : b.value > a.value ? -1 : 0
        )
        playCard(options[options.length - 1].card)
      }
    }
  }

  // User functions
  function sortHand(handArray) {
    let sortedHand = []
    Object.keys(SUIT_NAMES).forEach((suit) => {
      let filteredSuits = handArray.filter((card) => card[1] === suit)
      filteredSuits.sort((cardA, cardB) => {
        return RANK_VALUE[cardA] - RANK_VALUE[cardB]
      })
      sortedHand = sortedHand.concat(filteredSuits)
    })
    return sortedHand
  }

  // NPC functions
  function calculateWish(hand) {
    const handWithoutJacks = hand.filter((card) => card[0] !== "J")
    const wish = mode(handWithoutJacks.map((card) => card[1])) ?? "H"
    return wish
  }

  function playableCards(rank, suit, withoutJacks) {
    let cardsWithValues

    if (moves === 0) {
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
    moves += 1
    demandedSuit = ""

    const hand = $currentPlayer.playerHand
    const playedCard = hand.indexOf(card)
    const isUser = $currentPlayer.isUser

    pileDiscard = [...pileDiscard, hand.splice(playedCard, 1)[0]]
    updateCurrentCard(pileDiscard[pileDiscard.length - 1])
    updateThePlayers($thePlayers)

    if (hand.length === 0) {
      sendChatMessage(`hurra! GEWONNEN!!`)
      handleWin()
      return
    }

    if (hand.length === 1 && !isUser) {
      sendChatMessage(`letzte karte :P`)
    }

    if (card[0] === "7") {
      _7sPlayed++
      _7active = true
    }
    if (card[0] === "8") {
      _8active = true
    }
    if (card[0] === "J") {
      if (isUser) {
        showControlsUser = false
        showControlsWish = true
        return
      }
      demandedSuit = calculateWish(hand)
      sendChatMessage(`ich wünsch mir ${SUIT_NAMES[demandedSuit]}`)
    }
  }

  function drawCard() {
    if (!pileStock.length) {
      const newPileStock = pileDiscard.splice(0, pileDiscard.length - 1)
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
      const next = $thePlayers.indexOf($currentPlayer) + 1
      if (next === $thePlayers.length) {
        updateCurrentPlayer($thePlayers[0])
      } else {
        updateCurrentPlayer($thePlayers[next])
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
  function updateCurrentCard(card) {
    currentCard.update((c) => card)
  }

  function updateCurrentPlayer(player) {
    currentPlayer.update((p) => player)
  }

  function updateThePlayers(players) {
    thePlayers.update((p) => players)
  }

  function endSession() {
    currentCard.set("")
    currentPlayer.set({})
    thePlayers.set([])
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
    <div class="winner-screen">
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
      {#each pileDiscard as card (card)}
        <div
          class="pile-item"
          style:transform={`rotate(${
            Math.random() * 7 * (Math.random() < 0.5 ? -1 : 1)
          }deg)`}
          animate:flip={{ duration: 100 }}
          in:receive={{ key: card }}
          out:send={{ key: card }}
        >
          <Card {card} isPileCard={true} />
        </div>
      {/each}
    </div>
  </div>

  {#each $thePlayers as p}
    <Player
      playerName={p.playerName}
      playerId={p.playerId}
      playerIndex={p.playerIndex}
      playerHand={p.playerHand}
      {userIndex}
    >
      {#each p.playerHand as card, index (card)}
        <div
          class="card-wrapper"
          style:grid-column={`${index + 1} / span 2`}
          animate:flip={{ duration: 100 }}
          in:receive={{ key: card }}
          out:send={{ key: card }}
        >
          <Card
            {card}
            isUserCard={p.isUser}
            on:userPlayedCard={handleUserCard}
          />
        </div>
      {/each}
    </Player>
  {/each}

  <div class="chat-container">
    {#each chatMessages as m}
      <ChatMessage
        senderName={m.sender.playerName}
        senderColor={m.sender.playerColor}
        text={m.content}
      />
    {/each}
  </div>

  {#if showControlsWish}
    <div class="wish-controls">
      {#each Object.entries(SUIT_NAMES) as suit}
        <button
          class="btn"
          style:color={SUIT_COLOR[suit[0]]}
          on:click={() => handleWish(suit[0])}
        >
          {suit[1]}
        </button>
      {/each}
    </div>
  {/if}

  {#if showControlsUser}
    <UserControls
      mustDrawCards={_7active}
      amountOfSevens={_7sPlayed}
      missesTurn={_8active}
      on:drawCards={userDrawingCards}
      on:missTurn={userMissingTurn}
    />
  {/if}

  {#if !gameRunning && !winner}
    <button class="btn btn-play" on:click={startPlaying} transition:fade
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

  .card-wrapper {
    grid-row: 1;
  }

  .chat-container {
    position: absolute;
    right: -8px;
    top: 15vmin;
    width: 65%;
  }

  .wish-controls {
    /* position: absolute;
    bottom: 1em; */
    grid-column: 2;
    grid-row: 4;
    display: flex;
    gap: 0.75em;
  }

  .wish-controls > button {
    padding: 0.2em 0.5em;
    font-size: 1.5rem;
    background-color: #fff;
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
