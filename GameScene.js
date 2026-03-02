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
import { dialogueUI } from "./dialogueUI.js";
import { createStoryState } from "./storyState.js";
import { createDialogueManager } from "./dialogueManager.js";
import { createStorySystem } from "./storySystem.js";

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
  // ===== 1) Данные / состояние (без визуала) =====
  this.inventory = createInventory(this);

  // ===== 2) Игровые сущности =====
  this.player = createPlayer(this, 48, 90);
  this.player.sprite.setCollideWorldBounds(true);

  // ===== 3) Input =====
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

  // ===== 4) UI (DOM/подсказки и т.п.) =====
  this.hintE = createInteractionHint(this);

  // ===== 5) Камера =====
  this.cameras.main.startFollow(this.player.sprite);
  this.cameras.main.setZoom(3);

  // ===== 6) Уровни / карта =====
  // levelManager отвечает за: загрузку/смену карты, создание групп, world bounds, spawn
  this.levelManager = createLevelManager(this, {
    playerSprite: this.player.sprite,
  });

  this.storyState = createStoryState();
  this.dialogueManager = createDialogueManager(this, {
    inventory: this.inventory,
    state: this.storyState,
  });

  this.story = createStorySystem(this, {
    dialogueManager: this.dialogueManager,
  });

  this.story.playIntroOnce();

  // Загружаем стартовый уровень ДО систем, которые зависят от групп (items/doors)
  this.levelManager.load("testMap", null);

  // ===== 7) Системы (логика поверх мира) =====
  // interactionSystem: overlap предметов/дверей, подсказка E, обработка нажатия E
  this.interaction = createInteractionSystem(this, {
    playerSprite: this.player.sprite,
    keyE: this.keyE,
    hint: this.hintE,
    inventory: this.inventory,
    levelManager: this.levelManager,
  });

  // storySystem: сценарные реплики/триггеры (например, интро)
  this.story = createStorySystem(this);
  this.story.playIntroOnce();

  // ===== 8) UX =====
  // Фокус на canvas по клику, чтобы ввод с клавиатуры работал стабильно
  this.input.on("pointerdown", () => this.game.canvas.focus());
}

function update() {
  const blocked = dialogueUI.isOpen();

  this.player.updateMovement(this.cursors, { blocked });

  if (blocked) {
    this.hintE.hide();
    return;
  }

  this.interaction.update();
}
