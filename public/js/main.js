const moneyContainer = document.getElementById("money-container");
const upgradesContainer = document.getElementById("upgrades-container");
const buildingsContainer = document.getElementById("buildings-container");
const clickContainer = document.getElementById("click-container");

const currency = "$";

let gameState = {
  money: 0,
  initial: false,
  debug: false,
  globalMultiplier: 1,
  tapMultiplier: 1,
  upgrades: {},
  buildings: { "lemonade-stand": { amount: 5 } },
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

      document.getElementById("click-button");
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
  const upgradesList = [];
  const buildingsList = [];
  let renderedUpgrades;
  let renderedBuildings;

  for (const purchasable of gameState.initial
    ? purchasables.upgrades.initial
    : purchasables.upgrades.after) {
    if (gameState.debug) {
      console.log(purchasable);
    }
    if (
      purchasable.dependencies.every(
        (upgrade) => gameState.upgrades[upgrade] || gameState.buildings[upgrade]
      ) &&
      !gameState.upgrades[purchasable.id]
    ) {
      upgradesList.push(purchasable);
    }
  }

  for (const purchasable of gameState.initial
    ? purchasables.buildings.initial
    : purchasables.buildings.after) {
    if (gameState.debug) {
      console.log(purchasable);
    }
    if (
      purchasable.dependencies.every(
        (building) =>
          gameState.buildings[building] || gameState.upgrades[building]
      )
    ) {
      buildingsList.push(purchasable);
    }
  }

  if (gameState.debug) {
    console.log(upgradesList);
  }

  renderedUpgrades = renderPurchasableList(upgradesList);
  renderedUpgrades.prepend(
    (document.createElement("h3").textContent = "Upgrades")
  );
  renderedBuildings = renderPurchasableList(buildingsList);
  renderedBuildings.prepend(
    (document.createElement("h3").textContent = "Buildings")
  );

  upgradesContainer.innerHTML = "";
  buildingsContainer.innerHTML = "";
  upgradesContainer.appendChild(renderedUpgrades);
  buildingsContainer.appendChild(renderedBuildings);
}

function renderPurchasableList(purchasableList) {
  const list = document.createElement("ul");
  list.classList.add("purchasable-list");
  for (const purchasable of purchasableList) {
    list.appendChild(renderPurchasable(purchasable));
  }
  return list;
}

function renderPurchasable(purchasable) {
  const li = document.createElement("li");
  const title = document.createElement("h3");
  const img = document.createElement("img");
  const button = document.createElement("button");
  const description = document.createElement("p");
  const textWrapper = document.createElement("div");

  li.id = purchasable.id;
  li.classList.add("purchasable");

  title.textContent = purchasable.name;

  description.textContent = purchasable.description;

  img.src = purchasable.img;
  img.classList.add("purchasable-img");

  button.textContent = "Buy";
  button.classList.add("purchasable-button");

  textWrapper.classList.add("purchasable-text-wrapper");

  textWrapper.appendChild(title);
  textWrapper.appendChild(description);

  li.appendChild(img);
  li.appendChild(textWrapper);

  if (purchasable.type === "building") {
    const amountCounter = document.createElement("span");

    if (gameState.buildings[purchasable.id]) {
      amountCounter.textContent = gameState.buildings[purchasable.id].amount;
      button.textContent = "Buy for " + currency + (purchasable.basePrice * (1.12 ** gameState.buildings[purchasable.id].amount)).toFixed(0);
    } else {
      amountCounter.textContent = 0;
      button.textContent = "Buy for " + currency + purchasable.basePrice;
    }

    amountCounter.classList.add("amount-counter");
    li.appendChild(amountCounter);
  }

  li.appendChild(button);
  return li;
}

function renderClick() {
  const button = document.createElement("button");
  button.classList.add("click-button");
  button.textContent = gameState.initial ? "Work!" : "Amass wealth!";
  button.addEventListener("click", () => {
    buttonClicked();
  });
  clickContainer.innerHTML = "";
  clickContainer.appendChild(button);
}

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
  gameState.money +=
    7.25 * gameState.globalMultiplier * gameState.tapMultiplier;
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
