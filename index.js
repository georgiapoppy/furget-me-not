const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 550,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.removeMenu();
  win.loadFile("index.html");
  
  ipcMain.on("load-page", (event, page) => {
    win.loadFile(page);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

const flowerTypes = ['🌼', '🌹', '🌷'];
const pots = document.querySelectorAll('.pot');
const inventoryEl = document.getElementById('inventory');
const bouquetSlots = document.querySelectorAll('.bouquet-slot');
const coinsEl = document.getElementById('coins');

let inventory = [];
let bouquet = ['', '', ''];
let coins = 0;

// Grow flower in pot
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

// Update inventory display
function updateInventory() {
  inventoryEl.innerHTML = '';
  inventory.forEach((flower, index) => {
    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.textContent = flower;
    div.onclick = () => addToBouquet(flower, index);
    inventoryEl.appendChild(div);
  });
}

// Add flower to bouquet
function addToBouquet(flower, inventoryIndex) {
  const emptyIndex = bouquet.indexOf('');
  if (emptyIndex !== -1) {
    bouquet[emptyIndex] = flower;
    inventory.splice(inventoryIndex, 1);
    updateInventory();
    updateBouquet();
  }
}

// Update bouquet slots
function updateBouquet() {
  bouquetSlots.forEach((slot, i) => {
    slot.textContent = bouquet[i] || '';
  });
}

// Sell bouquet
function sellBouquet() {
  const count = bouquet.filter(Boolean).length;
  if (count === 0) return alert("No flowers in bouquet!");
  const saleValue = count * 10;
  coins += saleValue;
  coinsEl.textContent = coins;
  bouquet = ['', '', ''];
  updateBouquet();
}