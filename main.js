let coins = 100;
let seeds = [];
let pots = document.querySelectorAll('.pot');
const inventory = document.getElementById('inventory');
let flowers = [];
let orders = [];
const flowerTypes = ['🌹','🌼','🌷'];
let currentPage = 0;

const pages = ["shop", "grow", "inventory"];
let currentPageIndex = 0;

function showPage(index) {
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((page, i) => {
    page.style.transform = `translateX(${(i - index) * 100}%)`;
  });

  document.getElementById("left-arrow").style.visibility = index === 0 ? "hidden" : "visible";
  document.getElementById("right-arrow").style.visibility = index === pages.length - 1 ? "hidden" : "visible";

  currentPageIndex = index;
}

function navigate(direction) {
  if (direction === "left" && currentPageIndex > 0) {
    currentPageIndex--;
  } else if (direction === "right" && currentPageIndex < pages.length - 1) {
    currentPageIndex++;
  }
  showPage(currentPageIndex);
}


pots.forEach((pot, index) => {
    pot.addEventListener('click', () => {
        if (pot.dataset.growing === 'true') return;
        pot.dataset.growing = 'true';
        pot.textContent = '🌱';
        setTimeout(() => {
            const flower = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
            pot.textContent = flower;
            pot.dataset.flower = flower;
        }, 3000);
    });

    pot.addEventListener('dblclick', () => {
        if (pot.dataset.flower) {
            inventory.push(pot.dataset.flower);
            updateInventory();
            pot.textContent = '🪴';
            pot.dataset.flower = '';
            pot.dataset.growing = '';
        }
    });
});

function updateInventory() {
    inventory.innerHTML = '';
    inventory.forEach((flower, index) => {
    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.textContent = flower;
    div.onclick = () => addToBouquet(flower, index);
    inventory.appendChild(div);
    });
}

function updateShop() {
    const shop = document.getElementById('shop-items');
    shop.innerHTML = '';
    flowerTypes.forEach(flower => {
    const item = document.createElement('div');
    item.className = 'shop-item';
    item.textContent = `${flower} Seed - 10💰`;
    item.onclick = () => buySeed(flower);
    shop.appendChild(item);
    });
}

function buySeed(flower) {
    if (coins >= 10) {
    coins -= 10;
    seeds.push(flower);
    updatePots();
    } else {
    alert("Not enough coins!");
    }
}

function pickFlower(flower) {
    flowers.push(flower);
    updateInventory();
}

function generateOrder() {
    const needed = [];
    for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
    needed.push(flowerTypes[Math.floor(Math.random() * flowerTypes.length)]);
    }
    orders.push(needed);
    updateOrders();
}

function updateOrders() {
    const bar = document.getElementById('orders-bar');
    bar.innerHTML = '';
    orders.forEach((order, i) => {
    const div = document.createElement('div');
    div.innerHTML = `<div>${order.join(' ')}</div>`;
    const btn = document.createElement('button');
    btn.textContent = 'Deliver';
    btn.onclick = () => deliverOrder(i);
    div.appendChild(btn);
    bar.appendChild(div);
    });
}

function deliverOrder(index) {
    const order = orders[index];
    const match = JSON.stringify(bouquet) === JSON.stringify(order);
    if (match) {
    orders.splice(index, 1);
    coins += 30;
    alert("Delivered! +30 coins");
    bouquet = [];
    updateOrders();
    renderBouquet();
    } else {
    alert("Wrong bouquet!");
    }
}

window.onload = () => {
  showPage(0);
  updateShop();
};
