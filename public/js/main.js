const moneyContainer = document.getElementById("money-container");
const upgradesContainer = document.getElementById("upgrades-container");
const clickContainer = document.getElementById("click-container");

const currency = "$";

let money = 0;
let purchasables = {};

init();

function init() {
  fetch("/assets/game-content/purchasables.json")
    .then((response) => response.json())
    .then((data) => {
      purchasables = data;
      console.log(purchasables);

      renderAll();
    });
}

function renderAll() {
  renderMoney();
  renderPurchasables();
  renderClick();
}

function renderMoney() {
  const amountCounter = document.createElement("span");
  amountCounter.textContent = money;
  amountCounter.classList.add("money-counter");
  amountCounter.id = "money";

  moneyContainer.innerHTML = "";
  moneyContainer.appendChild(document.createTextNode(currency));
  moneyContainer.appendChild(amountCounter);
  updateMoneyAmountCounterPeriodically(document.getElementById("money"));
}

function renderPurchasables() {}

function renderClick() {}

function updateMoneyAmountCounterPeriodically(element) {
  setInterval(() => {
    element.textContent = money;
  }, 1000);
}
