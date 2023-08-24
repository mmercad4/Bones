const Player = (name, points = 0, hasRolled = false) => {
  return { name, points, hasRolled };
};

const Events = (() => {
  const endTurn = () => {
    const endTurnBtn = document.querySelector(".game__endTurn");
    endTurnBtn.addEventListener("click", Game.endTurn);
  };

  const addPlayerBtn = () => {
    const addPlayerBtn = document.querySelector(".addPlayers__Btn");
    const addPlayersValue = document.querySelector("#addPlayers__form");

    addPlayerBtn.addEventListener("click", () => {
      Game.addPlayer.call(null, addPlayersValue.value);
    });
  };

  const startGameBtn = () => {
    const startGameBtn = document.querySelector(".modal__button-start");
    startGameBtn.addEventListener("click", Game.startGame);
  };

  const initializeGameBtn = () => {
    const initializeGameBtn = document.querySelector(".players__start");
    initializeGameBtn.addEventListener("click", Game.initializeGame);
  };

  const decideFirstPlayer = () => {
    const modalBtn = document.querySelector(".modal__button");
    modalBtn.addEventListener("click", Game.decideFirstPlayer);
  };

  const rollDice = () => {
    const rollDiceBtn = document.querySelector(".game__roll");
    rollDiceBtn.addEventListener("click", Game.rollDice);
  };

  return {
    addPlayerBtn,
    initializeGameBtn,
    decideFirstPlayer,
    rollDice,
    endTurn,
    startGameBtn,
  };
})();

const Game = (() => {
  let players = [];
  let dice = [];
  let currentPlayerIndex = 0;
  let currentPoints;
  let currentTotal;
  let gameStarted = false;
  let winner = false;
  let ones = 0;
  let fives = 0;

  const getCurrentPoints = () => currentPoints;
  const getCurrentTotal = () => currentTotal;
  const getCurrentPlayerIndex = () => currentPlayerIndex;

  const rollDice = () => {
    dice = [];
    for (let i = 0; i < 5; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }

    console.log(dice);
    DisplayController.displayRoll(dice);

    Game.checkDice();

    DisplayController.displayCurrentPlayerInfo();
  };

  const startPlayerAdding = () => {
    console.log("PLAYER ADDING STARTED");
    DisplayController.removeIntro();
    DisplayController.displayAddPlayers();
    Events.addPlayerBtn();
    Events.initializeGameBtn();
  };

  const initializeGame = () => {
    if (players.length === 0) return;
    DisplayController.removeAddPlayers();
    DisplayController.displayGame();
    DisplayController.displayModal();
    Events.decideFirstPlayer();
    Events.endTurn();
  };

  const nextPlayer = () => {
    currentPlayerIndex++;

    if (currentPlayerIndex === players.length) {
      currentPlayerIndex = 0;
    }
  };

  const endTurn = () => {
    addPointsToCurrentPlayer();
    players[currentPlayerIndex].hasRolled = true;
    currentPoints = 0;
    nextPlayer();
    if (players[currentPlayerIndex].hasRolled && !gameStarted) {
      DisplayController.displayGameStartedModal();
    }
    DisplayController.updatePlayers();
    DisplayController.displayCurrentPlayerInfo();
  };

  const addPlayer = (name) => {
    if (!name) return;
    players.push(Player(name));
    DisplayController.displayNewPlayer();
  };

  const addPointsToCurrentPlayer = () => {
    players[currentPlayerIndex].points += currentPoints;
  };

  const decideFirstPlayer = () => {
    DisplayController.closeModal();
    Events.rollDice();
  };

  const pointConditions = {
    isLargeStraight: function (dice) {
      if (
        dice[0] === 2 &&
        dice[1] === 3 &&
        dice[2] === 4 &&
        dice[3] === 5 &&
        dice[4] === 6
      )
        return true;
    },

    isSmallStraight: function (dice) {
      if (
        dice[0] === 1 &&
        dice[1] === 2 &&
        dice[2] === 3 &&
        dice[3] === 4 &&
        dice[4] === 5
      )
        return true;
    },

    isYahtzee: function (dice) {
      if (
        dice[0] === dice[1] &&
        dice[0] === dice[2] &&
        dice[0] === dice[3] &&
        dice[0] === dice[4]
      )
        return true;
    },

    isFullHouse: function (dice) {
      if (
        (dice[0] === dice[1] && dice[2] === dice[3] && dice[2] === dice[4]) ||
        (dice[0] === dice[1] && dice[0] === dice[2] && dice[3] === dice[4])
      )
        return true;
    },

    isFourOfAKind: function (dice) {
      const counter = {};

      for (const die of dice) {
        counter[die] = counter[die] || 0;
        counter[die]++;
      }

      for (const key in counter) {
        if (counter[key] === 4) {
          return true;
        }
      }

      return false;
    },

    isThreeOfAKind: function (dice) {
      const counter = {};

      for (const die of dice) {
        counter[die] = counter[die] || 0;
        counter[die]++;
      }

      for (const key in counter) {
        if (counter[key] === 3) {
          return true;
        }
      }

      return false;
    },

    isFivesAndOnes: function (dice) {
      for (const die of dice) {
        if (die === 1) {
          ones++;
        } else if (die === 5) {
          fives++;
        }
      }

      return true;
    },
  };

  const startGame = () => {
    gameStarted = true;
    DisplayController.closeModal();
    players.forEach((player) => {
      player.points = 0;
    });
    DisplayController.updatePlayers();
    DisplayController.displayCurrentPlayerInfo();
  };

  const checkDice = () => {
    if (gameStarted === true) {
      dice.sort((a, b) => a - b);

      if (pointConditions.isLargeStraight(dice)) {
        currentPoints += 1000;
      } else if (pointConditions.isSmallStraight(dice)) {
        currentPoints += 2000;
      } else if (pointConditions.isYahtzee(dice)) {
        currentPoints += 10000;
      } else if (pointConditions.isFullHouse(dice)) {
        currentPoints += 3000;
      } else if (pointConditions.isFourOfAKind(dice)) {
        currentPoints += 5000;
      } else if (pointConditions.isThreeOfAKind(dice)) {
        currentPoints += 500;
      } else if (pointConditions.isFivesAndOnes(dice)) {
        currentPoints += ones * 100;
        currentPoints += fives * 50;
      }
    } else {
      const sum = dice.reduce((partialSum, a) => partialSum + a, 0);
      currentPoints = sum;
      currentTotal = players[currentPlayerIndex].points + sum;
    }
  };

  return {
    startPlayerAdding,
    addPlayer,
    players,
    initializeGame,
    currentPlayerIndex,
    decideFirstPlayer,
    rollDice,
    getCurrentPoints,
    endTurn,
    getCurrentTotal,
    getCurrentPlayerIndex,
    startGame,
    checkDice,
  };
})();

const DisplayController = (() => {
  const mainContainer = document.querySelector(".mainContainer");

  const removeIntro = () => {
    mainContainer.innerHTML = "";
  };

  const removeAddPlayers = () => {
    mainContainer.innerHTML = "";
  };

  const displayCurrentPlayerInfo = () => {
    const currentPlayerContainer = document.querySelector(
      ".game__currentPlayerInfo"
    );

    currentPlayerContainer.innerHTML = "";

    currentPlayerContainer.innerHTML = `
    <div class="game__currentPlayerName">${
      Game.players[Game.getCurrentPlayerIndex()].name
    }</div>
    <div class="game__curentPlayerPoints">${Game.getCurrentPoints()}</div>
    <div class="game__currentPlayerTotal">${
      Game.players[Game.getCurrentPlayerIndex()].points +
      Game.getCurrentPoints()
    }</div>`;
  };

  const displayRoll = (dice) => {
    const diceContainer = document.querySelector(".dice");
    diceContainer.innerHTML = "";
    dice.forEach((roll) => {
      diceContainer.innerHTML += `
        <li><img src="assets/dice-six-faces-${roll}.svg" alt="" /></li>`;
    });
  };

  const updatePlayers = () => {
    const playersContainer = document.querySelector(".game__players");
    playersContainer.innerHTML = "";
    Game.players.forEach((player) => {
      playersContainer.innerHTML += `
      <div class="player">${player.name} <span class="points">${player.points}</span></div>
        `;
    });
  };

  const displayAddPlayers = () => {
    mainContainer.innerHTML = `<div class="addPlayers">
    <div class="addPlayers__form">
      <input id="addPlayers__form" type="text" placeholder="add a player" />
      <button class="addPlayers__Btn">Add</button>
    </div>

    <div class="addPlayers__players">
    </div>

    <button class="players__start">START</button>

  </div>
    `;
  };

  const displayGame = () => {
    mainContainer.innerHTML = `    <div class="game">
      <div class="game__board">
        <ul class="dice">
          <li><img src="assets/dice-six-faces-5.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-5.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-5.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-5.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-5.svg" alt="" /></li>
        </ul>
      </div>

      <div class="game__currentPlayer">
        <div class="game__currentPlayerHeadings">
          <div class="game__curentPlayerNameHeading">Player Turn:</div>
          <div class="game__currentPlayerPointsHeading">Points this turn:</div>
          <div class="game__currentPlayerTotal">Total Points:</div>
        </div>
        <div class="game__currentPlayerInfo">
          <div class="game__currentPlayerName">${Game.players[0].name}</div>
          <div class="game__curentPlayerPoints">0</div>
          <div class="game__currentPlayerTotal">0</div>
        </div>
      </div>
      <div class="game__controls">
        <button class="game__roll">Roll</button>
        <button class="game__endTurn">End turn</button>
        <button class="game__restart">Restart</button>
      </div>
      <div class="game__players">
      </div>
    </div>

    <dialog id="modal">
      <div class="modal__info">
        <h1 class="modal__heading">Welcome to the game!</h1>
        <h3 class="modal__text">
          You all will take turns rolling the dice. The person with the highest
          roll will start the game!
        </h3>
        <button class="modal__button">Continue</button>
      </div>
    </dialog>`;

    const playersContainer = document.querySelector(".game__players");
    Game.players.forEach((player) => {
      playersContainer.innerHTML += `<div class="player">${player.name} <span class="points">${player.points}</span></div>`;
    });
  };

  const displayModal = () => {
    const modalContainer = document.querySelector("#modal");
    modalContainer.showModal();
    console.log("MODAL DISPLAYED");
  };

  const displayGameStartedModal = () => {
    const modalContainer = document.querySelector("#modal");
    modalContainer.innerHTML = `     
    <div class="modal__info">
    <h1 class="modal__heading">The game has started!</h1>
    <h3 class="modal__text">
      ${Game.players[Game.getCurrentPlayerIndex()].name} will start!
    </h3>
    <button class="modal__button-start">Start the game</button>
  </div>
    `;

    displayModal();
    Events.startGameBtn();
  };

  const closeModal = () => {
    const modalContainer = document.querySelector("#modal");
    modalContainer.close();
    console.log("MODAL CLOSED");
  };

  const displayNewPlayer = () => {
    const playersContainer = document.querySelector(".addPlayers__players");
    playersContainer.innerHTML = "";

    Game.players.forEach((player) => {
      playersContainer.innerHTML += `
      <div class="player">${player.name}<span class="player__points">${player.points}</span></div>
        `;
    });
  };

  return {
    removeIntro,
    removeAddPlayers,
    displayGame,
    displayAddPlayers,
    displayNewPlayer,
    displayModal,
    closeModal,
    displayRoll,
    displayCurrentPlayerInfo,
    updatePlayers,
    displayGameStartedModal,
  };
})();

const startBtn = document.querySelector(".introduction__start");
startBtn.addEventListener("click", Game.startPlayerAdding);
