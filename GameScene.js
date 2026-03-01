/*
  GameScene.js

  Основная игровая сцена (координационный слой).

  Отвечает за:
  - preload ассетов
  - первичную инициализацию: игрок, input, UI, загрузка стартового уровня
  - update-цикл: делегирование движения игрока и системы взаимодействия

  НЕ отвечает за:
  - загрузку/уничтожение уровня (levelManager)
  - хранение/синхронизацию инвентаря (inventory)
  - обработку overlap + подсказка + нажатие E (interactionSystem)
*/

import { createPlayer } from "./Player.js";
import { createInteractionHint } from "./ui.js";

// новые модули (дадим следующими файлами)
import { createLevelManager } from "./levelManager.js";
import { createInventory } from "./inventory.js";
import { createInteractionSystem } from "./interactionSystem.js";

export const GameScene = {
  preload,
  create,
  update,
};

function preload() {
  this.load.image("tiles", "assets/tileset.png");
  this.load.tilemapTiledJSON("testMap", "assets/maps/testMap.json");
  this.load.image("player", "assets/player.png");
  this.load.tilemapTiledJSON("corridor", "assets/maps/corridor.json");
  this.load.image("key", "assets/key.png");
}

function create() {
  // --- Inventory ---
  // хранит Set и синхронизирует с registry, но GameScene деталей не знает
  this.inventory = createInventory(this);

  // --- Player ---
  this.player = createPlayer(this, 48, 90);
  // ВАЖНО: границы мира теперь выставляет levelManager при загрузке уровня,
  // а игрок просто включает collideWorldBounds (это останется в Player.js/или тут, если решим).
  // Здесь ничего не меняем по поведению: player должен быть ограничен bounds.
  this.player.sprite.setCollideWorldBounds(true);

  // --- Input ---
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // --- UI ---
  this.hintE = createInteractionHint(this);

  // --- Camera (follow + zoom как было) ---
  this.cameras.main.startFollow(this.player.sprite);
  this.cameras.main.setZoom(3);

  // --- Level Manager ---
  // управляет загрузкой/сменой карты, уничтожением старых групп, bounds, spawn
  this.levelManager = createLevelManager(this, {
    playerSprite: this.player.sprite,
  });

  // стартовый уровень как и раньше: testMap + слой BackGround + коллизии/двери/предметы
  this.levelManager.load("testMap", null);

  // --- Interaction System ---
  // отвечает за overlap (items/doors), подсказку hintE и обработку E
  this.interaction = createInteractionSystem(this, {
    playerSprite: this.player.sprite,
    keyE: this.keyE,
    hint: this.hintE,
    inventory: this.inventory,
    levelManager: this.levelManager,
  });

  // UX: фокус на canvas по клику (как было)
  this.input.on("pointerdown", () => this.game.canvas.focus());
}

function update() {
  // движение игрока остаётся в Player.js
  this.player.updateMovement(this.cursors);

  // вся логика взаимодействий вынесена
  this.interaction.update();
}
