const moneyContainer = document.getElementById("money-container");
const upgradesContainer = document.getElementById("upgrades-container");
const clickContainer = document.getElementById("click-container");

const currency = "$";

let gameState = {
  money: 0,
  initial: true,
  debug: false,
  globalMultiplier: 1,
  tapMultiplier: 1,
  upgrades: [],
  buildings: [],
};
let purchasables = {};

init();

function init() {
  fetch("/assets/game-content/purchasables.json")
    .then((response) => response.json())
    .then((data) => {
      purchasables = data;
      if (gameState.debug) {
        console.log(purchasables);
      }

      restoreGameState();
      renderAll();
      saveGameStatePeriodically();

      document.getElementById("click-button").addEventListener("click", () => {
        buttonClicked();
      });
    });
}

function renderAll() {
  renderMoney();
  renderPurchasables();
  renderClick();
}

function renderMoney() {
  const amountCounter = document.createElement("span");
  amountCounter.textContent = gameState.money;
  amountCounter.classList.add("money-counter");
  amountCounter.id = "money";

  moneyContainer.innerHTML = "";
  moneyContainer.appendChild(document.createTextNode(currency));
  moneyContainer.appendChild(amountCounter);
  updateMoneyAmountCounterPeriodically(document.getElementById("money"));
}

function renderPurchasables() {
  upgradesContainer.innerHTML = "";
  upgradesContainer.appendChild(renderPurchasableList(gameState.initial ? purchasables.upgrades.initial : purchasables.upgrades.after));
}

function renderPurchasableList(purchasableList) {
  const list = document.createElement("ul");
  for (const purchasable of purchasableList) {
    list.appendChild(renderPurchasable(purchasable));
  }
  return list;
}

function renderPurchasable(purchasable) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(purchasable.name));
  return li;
}

function renderClick() {}

function updateMoneyAmountCounterPeriodically(element) {
  let lastValue = 0;
  setInterval(() => {
    if (gameState.debug) {
      console.log("Updating money...");
    }
    if (!(gameState.money === lastValue)) {
      if (gameState.debug) {
        console.log("Money changed");
      }
      element.textContent = gameState.money;
      lastValue = gameState.money;
    }
  }, 100);
}

function buttonClicked() {
  gameState.money += 7.25 * gameState.globalMultiplier * gameState.tapMultiplier;
}

function saveGameStatePeriodically() {
  setInterval(() => {
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, 1000);
}

function restoreGameState() {
  if (localStorage.getItem("gameState")) {
    gameState = JSON.parse(localStorage.getItem("gameState"));
  }
}
