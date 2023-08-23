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
    startGameBtn.addEventListener("click", Game.startGame);
  };

  return {
    addPlayerBtn,
    startGameBtn,
  };
})();

const Game = (() => {
  players = [];

  const startPlayerAdding = () => {
    console.log("PLAYER ADDING STARTED");
    DisplayController.removeIntro();
    DisplayController.displayGame();
    DisplayController.displayAddPlayers();
    Events.addPlayerBtn();
    Events.startGameBtn();
  };

  const startGame = () => {
    DisplayController.removeAddPlayers();
    console.log("GAME STARTED");
  };

  const addPlayer = (name) => {
    if (!name) return;
    players.push(Player(name));
    DisplayController.displayNewPlayer();
  };

  return {
    startPlayerAdding,
    addPlayer,
    players,
    startGame,
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

  const displayNewPlayer = () => {
    const playersContainer = document.querySelector(".addPlayers__players");
    playersContainer.innerHTML = "";

    Game.players.forEach((player) => {
      playersContainer.innerHTML += `
      <div class="player">${player.name}<span class="player__points">${player.points}</span></div>
        `;
    });
  };

  const displayGame = () => {
    console.log("GAME DISPLAYED");
  };

  return {
    removeIntro,
    removeAddPlayers,
    displayGame,
    displayAddPlayers,
    displayNewPlayer,
  };
})();

const startBtn = document.querySelector(".introduction__start");
startBtn.addEventListener("click", Game.startPlayerAdding);
