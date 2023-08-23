const Player = (name, points = 0) => {
  return { name, points };
};

const Events = (() => {
  const addPlayerBtn = () => {
    const addPlayerBtn = document.querySelector(".addPlayers__Btn");
    const addPlayersValue = document.querySelector("#addPlayers__form");

    addPlayerBtn.addEventListener("click", () => {
      Game.addPlayer.call(null, addPlayersValue.value);
    });
  };

  const startGameBtn = () => {
    const startGameBtn = document.querySelector(".players__start");
    startGameBtn.addEventListener("click", Game.initializeGame);
  };

  const decideFirstPlayer = () => {
    const modalBtn = document.querySelector(".modal__button");
    modalBtn.addEventListener("click", Game.decideFirstPlayer);
  };

  return {
    addPlayerBtn,
    startGameBtn,
    decideFirstPlayer,
  };
})();

const Game = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let currentPoints = 0;

  const startPlayerAdding = () => {
    console.log("PLAYER ADDING STARTED");
    DisplayController.removeIntro();
    DisplayController.displayAddPlayers();
    Events.addPlayerBtn();
    Events.startGameBtn();
  };

  const initializeGame = () => {
    if (players.length === 0) return;
    DisplayController.removeAddPlayers();
    DisplayController.displayGame();
    DisplayController.displayModal();
    Events.decideFirstPlayer();
  };

  const addPlayer = (name) => {
    if (!name) return;
    players.push(Player(name));
    DisplayController.displayNewPlayer();
  };

  const decideFirstPlayer = () => {
    DisplayController.closeModal();
    //
  };

  return {
    startPlayerAdding,
    addPlayer,
    players,
    initializeGame,
    currentPlayerIndex,
    decideFirstPlayer,
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
        <ul>
          <li><img src="assets/dice-six-faces-five.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-five.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-five.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-five.svg" alt="" /></li>
          <li><img src="assets/dice-six-faces-five.svg" alt="" /></li>
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
  };
})();

const startBtn = document.querySelector(".introduction__start");
startBtn.addEventListener("click", Game.startPlayerAdding);
