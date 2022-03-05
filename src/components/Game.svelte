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
    sessionEnded,
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

  // Game init
  let moves = 0

  let cardDeck = []

  let pileDiscard = []
  let pileStock = []

  let _7sPlayed = 0
  let _7active = false

  let _8active = false

  let demandedSuit = ""

  let gameRunning = false
  let winner = null

  let showUserControls = false
  let wishControls = false

  let chatMessages = []

  const userIndex = Math.floor(Math.random() * $noOfPlayers)

  cardDeck = $noOfDecks === 2 ? CARDS.concat(CARDS) : CARDS

  onMount(() => {
    let initPlayers = []
    for (let i = 0; i < $noOfPlayers; i++) {
      const p = {
        playerId: uuidv4(),
        playerHand: [],
        playerName: i === userIndex ? $username : `Spieler 0${i + 1}`,
        playerColor: PLAYER_CLR[i],
        playerIndex: i,
        isUser: i === userIndex,
      }
      for (let j = 0; j < $cardsPerPlayer; j++) {
        p.playerHand.push(drawFrom(cardDeck, true))
      }
      initPlayers.push(p)
    }

    updateThePlayers(initPlayers)

    pileDiscard = [...pileDiscard, drawFrom(cardDeck, true)]
    updateCurrentCard(pileDiscard[pileDiscard.length - 1])

    pileStock = shuffle(cardDeck)

    updateCurrentPlayer($thePlayers[0])
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
    showUserControls = false
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
      showUserControls = true
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
    // updateThePlayers($thePlayers)
    takeTurns()
  }

  function handleUserCard(event) {
    if (!gameRunning) return

    const userCard = event.detail.card
    const cardInstance = event.detail.cardInstance

    if (!isPlayable(userCard)) {
      handleForbidden()
    } else {
      playUserCard(userCard)
      if (!wishControls) {
        nextPlayer()
        takeTurns()
      }
    }

    function isPlayable(card) {
      if (moves === 0) return true

      const currentRank = $currentCard[0]
      const currentSuit = demandedSuit || $currentCard[1]

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

  function playUserCard(card) {
    moves += 1
    demandedSuit = ""

    const hand = $currentPlayer.playerHand
    const playedCard = hand.indexOf(card)
    pileDiscard = [...pileDiscard, hand.splice(playedCard, 1)[0]]
    updateCurrentCard(pileDiscard[pileDiscard.length - 1])
    updateThePlayers($thePlayers)

    if (hand.length === 0) {
      sendChatMessage(`hurra! GEWONNEN!!`)
      handleWin()
      return
    }

    if (card[0] === "7") {
      _7sPlayed++
      _7active = true
    }

    if (card[0] === "8") {
      _8active = true
    }

    if (card[0] === "J") {
      wishControls = true
    }

    showUserControls = false
  }

  function handleWish(suit) {
    demandedSuit = suit
    wishControls = false
    nextPlayer()
    takeTurns()
  }

  function moveNpc() {
    const hand = $currentPlayer.playerHand
    const currentRank = $currentCard[0]
    const currentSuit = demandedSuit || $currentCard[1]

    if (currentRank === "7" && _7active) {
      handle_7()
      nextPlayer()
    } else if (currentRank === "8" && _8active) {
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

    function playCard(card) {
      moves += 1

      demandedSuit = ""
      const playedCard = hand.indexOf(card)

      if (card[0] === "7") {
        _7sPlayed++
        _7active = true
      }
      if (card[0] === "8") {
        _8active = true
      }
      if (card[0] === "J") {
        demandedSuit = calculateWish()
        sendChatMessage(`ich wünsch mir ${SUIT_NAMES[demandedSuit]}`)
      }

      pileDiscard = [...pileDiscard, hand.splice(playedCard, 1)[0]]
      updateCurrentCard(pileDiscard[pileDiscard.length - 1])

      if (hand.length === 1) {
        sendChatMessage(`letzte karte :P`)
      }

      if (hand.length === 0) {
        sendChatMessage(`hurra! GEWONNEN!!`)
        handleWin()
        return
      }
    }

    function calculateWish() {
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
  }

  // Basic game functions
  function drawCard() {
    if (!pileStock.length) {
      const newPileStock = pileDiscard.splice(0, pileDiscard.length - 1)
      pileStock = shuffle(newPileStock)
    }
    $currentPlayer.playerHand = [
      ...$currentPlayer.playerHand,
      drawFrom(pileStock),
    ]
  }

  function nextPlayer() {
    if (!$sessionEnded && gameRunning) {
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

  function endSession(status) {
    gameRunning = false
    sessionEnded.update((s) => status)
  }

  // Animations
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 1000),
    easing: expoOut,
  })
</script>

<div class="game-table" transition:scale>
  <div class="pile-discard">
    {#if demandedSuit}
      <div
        class="demanded-suit"
        style:color={SUIT_COLOR[demandedSuit]}
        transition:scale
      >
        {SUIT_NAMES[demandedSuit]}
      </div>
    {/if}
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
            isUserCard={p.playerIndex === userIndex}
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

  {#if wishControls}
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

  {#if showUserControls}
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
  <button class="btn btn-quit" on:click={() => endSession(true)}>Beenden</button
  >
</div>

<style>
  .game-table {
    position: absolute;
    display: grid;
    place-items: center;
    grid-template-columns: 5rem 10rem 5rem;
    grid-template-rows: 5rem 10rem 10rem 2rem;
    gap: 1em;
    width: 100%;
    height: 100%;
    padding: 1em;
    background-color: forestgreen;
  }

  .pile-discard {
    place-self: center;
    grid-column: 2;
    grid-row: 2;
    display: grid;
    place-items: center;
    position: relative;
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

  /* .pile-stock {
    font-size: 4rem;
  } */

  .card-wrapper {
    grid-row: 1;
  }

  .chat-container {
    position: absolute;
    right: -8px;
    top: 15vmin;
    width: 65%;
  }

  .btn-play {
    /* position: absolute; */
    /* bottom: 0; */
    /* margin-bottom: 2em; */
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

  .wish-controls {
    position: absolute;
    bottom: 1em;
    display: flex;
    gap: 0.75em;
  }

  .wish-controls > button {
    padding: 0.2em 0.5em;
    font-size: 1.5rem;
    background-color: #fff;
  }
</style>
